-- Create enum for product locations
CREATE TYPE public.product_location AS ENUM ('RA1', 'RA2', 'RA3', 'RA4');

-- Add location column to products table
ALTER TABLE public.products 
ADD COLUMN location public.product_location;

-- Add stock quantity for inventory management
ALTER TABLE public.products 
ADD COLUMN stock_quantity integer DEFAULT 0,
ADD COLUMN low_stock_threshold integer DEFAULT 10,
ADD COLUMN sku text;

-- Update the product code generation function to include location
CREATE OR REPLACE FUNCTION public.generate_product_code(p_location text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  sequence_num INTEGER;
  new_code TEXT;
BEGIN
  -- Get the count of products for this location
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM public.products
  WHERE location = p_location::product_location;
  
  new_code := p_location || '-' || LPAD(sequence_num::TEXT, 5, '0');
  
  RETURN new_code;
END;
$$;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_products_location ON public.products(location);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_name_search ON public.products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON public.products USING gin(to_tsvector('english', description));