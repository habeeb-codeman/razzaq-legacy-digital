-- Fix search_path for generate_product_code function
CREATE OR REPLACE FUNCTION public.generate_product_code(p_location text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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