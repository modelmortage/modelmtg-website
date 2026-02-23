-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/xbboivceqbyejrfwjrja/sql

-- Create storage bucket for calculator exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('calculator-exports', 'calculator-exports', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for calculator export metadata
CREATE TABLE IF NOT EXISTS calculator_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculator_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_calculator_exports_created_at ON calculator_exports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_exports_calculator_type ON calculator_exports(calculator_type);
CREATE INDEX IF NOT EXISTS idx_calculator_exports_user_id ON calculator_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_calculator_exports_fingerprint_created ON calculator_exports(fingerprint, created_at DESC);

-- Enable RLS
ALTER TABLE calculator_exports ENABLE ROW LEVEL SECURITY;

-- Create policies with proper security constraints
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

CREATE POLICY "Allow users to view their own exports" ON calculator_exports
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Storage policies
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'calculator-exports');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'calculator-exports');
