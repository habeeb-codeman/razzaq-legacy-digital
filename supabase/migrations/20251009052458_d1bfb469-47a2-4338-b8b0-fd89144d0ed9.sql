-- Fix security warning for generate_bill_number function
CREATE OR REPLACE FUNCTION public.generate_bill_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_number INTEGER;
  new_number TEXT;
BEGIN
  -- Get the highest bill number
  SELECT COALESCE(MAX(CAST(SUBSTRING(bill_number FROM 4) AS INTEGER)), 0) + 1
  INTO max_number
  FROM public.bills;
  
  new_number := 'INV' || max_number::TEXT;
  
  RETURN new_number;
END;
$$;