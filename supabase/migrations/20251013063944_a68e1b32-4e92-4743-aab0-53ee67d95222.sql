-- Ensure generate_bill_number function has correct security settings
CREATE OR REPLACE FUNCTION public.generate_bill_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  max_number INTEGER;
  new_number TEXT;
BEGIN
  -- Get the highest bill number
  SELECT COALESCE(MAX(CAST(SUBSTRING(bill_number FROM 4) AS INTEGER)), 0) + 1
  INTO max_number
  FROM public.bills;
  
  new_number := 'INV' || LPAD(max_number::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$;

-- Add pdf_url column to bills table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bills' 
    AND column_name = 'pdf_url'
  ) THEN
    ALTER TABLE public.bills ADD COLUMN pdf_url TEXT;
  END IF;
END $$;

-- Create bills storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bills',
  'bills',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload bills" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view bills" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete bills" ON storage.objects;

-- Create storage policies for bills bucket
CREATE POLICY "Admins can upload bills"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bills' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view bills"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'bills' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete bills"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'bills' AND
  has_role(auth.uid(), 'admin'::app_role)
);