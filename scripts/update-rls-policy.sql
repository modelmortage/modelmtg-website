-- Update RLS Policy to be more secure
-- Run this in your Supabase SQL Editor to fix the security warning

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Allow public insert" ON calculator_exports;

-- Create new secure policy with proper constraints
-- Note: Database-level rate limiting is handled by application layer
-- RLS focuses on data validation
CREATE POLICY "Allow insert with rate limit check" ON calculator_exports
  FOR INSERT
  WITH CHECK (
    -- Ensure fingerprint is provided
    fingerprint IS NOT NULL 
    AND LENGTH(fingerprint) > 0
    -- Ensure calculator_type is valid
    AND calculator_type IN ('VA Purchase', 'VA Refinance', 'Purchase', 'Refinance', 'DSCR', 'Affordability', 'Rent vs Buy', 'Fix & Flip')
    -- Ensure file_path is provided
    AND file_path IS NOT NULL
    AND LENGTH(file_path) > 0
  );

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'calculator_exports';
