-- Create bills table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL UNIQUE,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  party_name TEXT NOT NULL,
  party_address TEXT,
  party_gstin TEXT,
  party_phone TEXT,
  place_of_supply TEXT NOT NULL DEFAULT 'Andhra Pradesh - 37',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  cgst_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  sgst_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  remaining_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bill_items table
CREATE TABLE public.bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  hsn_sac TEXT NOT NULL DEFAULT '8708',
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'Pcs',
  rate NUMERIC(10,2) NOT NULL,
  taxable_value NUMERIC(10,2) NOT NULL,
  cgst_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
  sgst_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
  cgst_amount NUMERIC(10,2) NOT NULL,
  sgst_amount NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bills
CREATE POLICY "Admins can view all bills"
ON public.bills FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert bills"
ON public.bills FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bills"
ON public.bills FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bills"
ON public.bills FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for bill_items
CREATE POLICY "Admins can view all bill items"
ON public.bill_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert bill items"
ON public.bill_items FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bill items"
ON public.bill_items FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bill items"
ON public.bill_items FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to generate bill number
CREATE OR REPLACE FUNCTION public.generate_bill_number()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Trigger to update updated_at
CREATE TRIGGER update_bills_updated_at
BEFORE UPDATE ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_bills_bill_number ON public.bills(bill_number);
CREATE INDEX idx_bills_created_at ON public.bills(created_at DESC);
CREATE INDEX idx_bill_items_bill_id ON public.bill_items(bill_id);