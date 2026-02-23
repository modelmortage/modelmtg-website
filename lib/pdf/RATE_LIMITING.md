# PDF Export Rate Limiting

## Overview

Rate limiting prevents abuse of the PDF export feature by restricting users to 15 exports per 24-hour period.

## How It Works

### 1. Browser Fingerprinting

The system generates a unique fingerprint for each browser based on:
- User agent
- Language
- Screen resolution and color depth
- Timezone offset
- Hardware concurrency
- Platform

This fingerprint is stored with each export to track usage per device/browser.

### 2. Rate Limit Checking

Before each export:
1. Generate browser fingerprint
2. Query database for exports in last 24 hours with same fingerprint
3. If count >= 15, reject the export
4. If count < 15, allow and show remaining exports

### 3. Reset Window

The 24-hour window is rolling:
- If you export at 10:00 AM on Monday, that export expires at 10:00 AM on Tuesday
- Each export has its own 24-hour expiration
- The limit resets gradually as old exports age out

## Configuration

### Change the Limit

Edit `lib/pdf/rateLimiter.ts`:

```typescript
const MAX_EXPORTS_PER_DAY = 15  // Change this number
```

### Change the Time Window

Edit `lib/pdf/rateLimiter.ts`:

```typescript
const RATE_LIMIT_WINDOW_HOURS = 24  // Change to 12, 48, etc.
```

## User Experience

### Normal Usage (Under Limit)

```
┌─────────────────────────┐
│ [📄 Export to PDF]      │
│ 12 exports remaining    │
└─────────────────────────┘
```

### Approaching Limit

```
┌─────────────────────────┐
│ [📄 Export to PDF]      │
│ 2 exports remaining     │
└─────────────────────────┘
```

### Limit Reached

```
┌─────────────────────────┐
│ [⚠️ Limit Reached]      │
│ Daily limit reached.    │
│ Resets in 3 hours and   │
│ 45 minutes              │
└─────────────────────────┘
```

## Database Schema

### Fingerprint Column

```sql
fingerprint TEXT NOT NULL
```

Stores the browser fingerprint hash for rate limiting.

### Index for Performance

```sql
CREATE INDEX idx_calculator_exports_fingerprint_created 
ON calculator_exports(fingerprint, created_at DESC);
```

Optimizes rate limit queries.

## Security Considerations

### Fingerprint Limitations

Browser fingerprinting is not foolproof:
- Users can clear browser data
- VPNs/proxies don't affect fingerprints
- Different browsers = different fingerprints
- Incognito mode may generate different fingerprints

### Why This Approach?

1. **No Authentication Required**: Works for anonymous users
2. **Privacy-Friendly**: No personal data collected
3. **Good Enough**: Prevents casual abuse
4. **User-Friendly**: No login required

### For Stricter Limits

If you need stronger rate limiting:

1. **Require Authentication**:
   ```typescript
   // Check user_id instead of fingerprint
   const userId = (await supabase.auth.getUser()).data.user?.id
   ```

2. **Use IP Address** (requires server-side):
   ```typescript
   // In API route
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
   ```

3. **Combine Multiple Factors**:
   ```typescript
   // Use fingerprint + IP + user_id
   const identifier = `${fingerprint}_${ip}_${userId}`
   ```

## Testing Rate Limits

### Test in Development

```typescript
// Temporarily reduce limit for testing
const MAX_EXPORTS_PER_DAY = 3  // Test with 3 exports
```

### Bypass for Testing

```typescript
// Add bypass flag (remove in production!)
if (process.env.NODE_ENV === 'development') {
  return { allowed: true, remaining: 999, resetTime: null }
}
```

### Check Current Usage

Query Supabase to see exports:

```sql
SELECT 
  fingerprint,
  COUNT(*) as export_count,
  MAX(created_at) as last_export
FROM calculator_exports
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY fingerprint
ORDER BY export_count DESC;
```

## Error Handling

### Rate Limit Check Fails

If the database query fails, the system allows the export to prevent blocking legitimate users:

```typescript
if (error) {
  return {
    allowed: true,
    remaining: MAX_EXPORTS_PER_DAY,
    resetTime: null,
    message: 'Rate limit check failed, allowing export'
  }
}
```

### Network Issues

If Supabase is unreachable, exports are allowed to maintain functionality.

## Monitoring

### Track Rate Limit Hits

Query exports at the limit:

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT fingerprint) as unique_users_at_limit
FROM calculator_exports
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Average Exports Per User

```sql
SELECT 
  AVG(export_count) as avg_exports_per_user
FROM (
  SELECT 
    fingerprint,
    COUNT(*) as export_count
  FROM calculator_exports
  WHERE created_at > NOW() - INTERVAL '24 hours'
  GROUP BY fingerprint
) subquery;
```

## Customization Examples

### Different Limits for Different Calculators

```typescript
const LIMITS: Record<string, number> = {
  'VA Purchase': 20,
  'Purchase': 15,
  'DSCR': 10,
  'default': 15
}

const limit = LIMITS[calculatorType] || LIMITS.default
```

### Premium Users Get More Exports

```typescript
const isPremium = await checkPremiumStatus(userId)
const limit = isPremium ? 50 : 15
```

### Time-Based Limits

```typescript
// More exports during business hours
const hour = new Date().getHours()
const isBusinessHours = hour >= 9 && hour <= 17
const limit = isBusinessHours ? 20 : 10
```

## Troubleshooting

### "Rate limit exceeded" but user hasn't exported

1. Check if fingerprint collision (rare but possible)
2. User may have exported from same browser earlier
3. Check database for exports with that fingerprint

### Rate limit not working

1. Verify fingerprint column exists in database
2. Check index is created
3. Verify `checkRateLimit()` is called before export
4. Check browser console for errors

### Users complaining about limit

1. Check if limit is too restrictive
2. Consider increasing to 20-25 exports
3. Add authentication for higher limits
4. Provide clear messaging about reset time
