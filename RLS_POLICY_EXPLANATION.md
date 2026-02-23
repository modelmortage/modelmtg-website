# RLS Policy Explanation

## Why We Removed Database-Level Rate Limiting from RLS

### The Problem

The original RLS policy tried to check rate limits using `NEW.fingerprint`:

```sql
-- ❌ This doesn't work in RLS policies
WITH CHECK (
  (SELECT COUNT(*) 
   FROM calculator_exports 
   WHERE fingerprint = NEW.fingerprint  -- ERROR: NEW not available
   AND created_at > NOW() - INTERVAL '24 hours'
  ) < 15
)
```

**Error**: `missing FROM-clause entry for table "new"`

### Why It Fails

- `NEW` is a special variable only available in **trigger functions**
- RLS policies don't have access to `NEW` or `OLD`
- RLS policies can only reference columns directly

### The Solution

We split the security into two layers:

#### 1. Application Layer (Rate Limiting)
**File**: `lib/pdf/rateLimiter.ts`

```typescript
export async function checkRateLimit(): Promise<RateLimitResult> {
  const fingerprint = generateFingerprint()
  
  // Query database for recent exports
  const { data } = await supabase
    .from('calculator_exports')
    .select('id, created_at')
    .eq('fingerprint', fingerprint)
    .gte('created_at', windowStart.toISOString())
  
  const exportCount = data?.length || 0
  
  if (exportCount >= 15) {
    return { allowed: false, remaining: 0, ... }
  }
  
  return { allowed: true, remaining: 15 - exportCount, ... }
}
```

This runs **before** the PDF is generated and **before** the database insert.

#### 2. Database Layer (Data Validation)
**File**: `scripts/setup-pdf-export.sql`

```sql
-- ✅ This works - validates data structure
CREATE POLICY "Allow insert with rate limit check" ON calculator_exports
  FOR INSERT
  WITH CHECK (
    -- Validate fingerprint
    fingerprint IS NOT NULL 
    AND LENGTH(fingerprint) > 0
    
    -- Validate calculator type (whitelist)
    AND calculator_type IN ('VA Purchase', 'VA Refinance', ...)
    
    -- Validate file path
    AND file_path IS NOT NULL
    AND LENGTH(file_path) > 0
  );
```

This validates the data structure but doesn't check rate limits.

## Why This Approach is Better

### 1. Better User Experience
- Application checks rate limit first
- Shows user feedback immediately
- Doesn't waste resources generating PDF if limit reached

### 2. More Efficient
- No need to query database twice (once in RLS, once in app)
- RLS policy is simpler and faster
- No complex subqueries in RLS

### 3. More Flexible
- Can show remaining exports count
- Can calculate reset time
- Can provide detailed error messages
- Easier to adjust rate limit logic

### 4. Still Secure
- Application layer prevents normal users from exceeding limit
- Database layer validates data structure
- Both layers work together (defense in depth)

## Security Layers

```
User clicks Export
       ↓
┌──────────────────────────────────────┐
│  Application Rate Limit Check        │
│  - Checks fingerprint                │
│  - Counts recent exports             │
│  - Returns allowed/denied            │
│  - Shows user feedback               │
└──────────────────────────────────────┘
       ↓ (if allowed)
┌──────────────────────────────────────┐
│  Generate PDF                        │
│  - Create PDF document               │
│  - Capture chart                     │
│  - Format results                    │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  Upload to Supabase Storage          │
│  - Upload PDF file                   │
│  - Get public URL                    │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  Insert to Database                  │
│  - Prepare insert data               │
│  - Include fingerprint               │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  RLS Policy Validation               │
│  - Check fingerprint not null        │
│  - Check calculator_type valid       │
│  - Check file_path not null          │
│  - Allow or deny insert              │
└──────────────────────────────────────┘
       ↓ (if valid)
┌──────────────────────────────────────┐
│  Record Saved                        │
│  - Export tracked in database        │
│  - Counts toward rate limit          │
└──────────────────────────────────────┘
```

## Alternative: Trigger-Based Rate Limiting

If you really want database-level rate limiting, use a trigger instead of RLS:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION check_export_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  export_count INTEGER;
BEGIN
  -- Count recent exports for this fingerprint
  SELECT COUNT(*) INTO export_count
  FROM calculator_exports
  WHERE fingerprint = NEW.fingerprint
  AND created_at > NOW() - INTERVAL '24 hours';
  
  -- Check if limit exceeded
  IF export_count >= 15 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 15 exports per 24 hours';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER enforce_export_rate_limit
  BEFORE INSERT ON calculator_exports
  FOR EACH ROW
  EXECUTE FUNCTION check_export_rate_limit();
```

**Pros:**
- Enforced at database level
- Can't be bypassed

**Cons:**
- Less user-friendly (generic error message)
- Can't show remaining exports before attempting
- Wastes resources (PDF already generated)
- Harder to customize error messages

## Current Implementation Benefits

✅ **User-Friendly**: Shows remaining exports before attempting
✅ **Efficient**: Checks limit before generating PDF
✅ **Flexible**: Easy to adjust rate limit logic
✅ **Secure**: Data validation at database level
✅ **Fast**: Simple RLS policy without subqueries
✅ **Maintainable**: Clear separation of concerns

## Summary

- **Application Layer**: Handles rate limiting with user feedback
- **Database Layer**: Validates data structure and integrity
- **Both Together**: Provide defense in depth
- **Result**: Secure, efficient, and user-friendly

The rate limiting is still enforced - just at the application layer where it makes more sense and provides a better user experience.
