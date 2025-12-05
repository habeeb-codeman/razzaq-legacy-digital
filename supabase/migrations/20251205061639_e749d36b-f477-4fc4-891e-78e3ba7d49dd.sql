-- Add status and review notes fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'under_review', 'damaged', 'discontinued')),
ADD COLUMN IF NOT EXISTS review_notes text,
ADD COLUMN IF NOT EXISTS flagged_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS flagged_by uuid;

-- Create scan history table to track all QR scans
CREATE TABLE public.scan_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  scanned_by uuid,
  action text NOT NULL CHECK (action IN ('view', 'sold', 'stock_up', 'location_change', 'flag', 'unflag')),
  quantity_change integer,
  old_stock integer,
  new_stock integer,
  old_location text,
  new_location text,
  notes text,
  scanned_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on scan_history
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for scan_history
CREATE POLICY "Admins can view all scan history" 
ON public.scan_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert scan history" 
ON public.scan_history 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_scan_history_product_id ON public.scan_history(product_id);
CREATE INDEX idx_scan_history_scanned_at ON public.scan_history(scanned_at DESC);
CREATE INDEX idx_products_status ON public.products(status);