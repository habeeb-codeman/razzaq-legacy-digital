-- Create location history table to track product movements between warehouses
CREATE TABLE IF NOT EXISTS public.product_location_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  old_location product_location,
  new_location product_location NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS on location history
ALTER TABLE public.product_location_history ENABLE ROW LEVEL SECURITY;

-- Admins can view all location history
CREATE POLICY "Admins can view all location history"
ON public.product_location_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert location history
CREATE POLICY "Admins can insert location history"
ON public.product_location_history
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_product_location_history_product_id ON public.product_location_history(product_id);
CREATE INDEX idx_product_location_history_changed_at ON public.product_location_history(changed_at DESC);