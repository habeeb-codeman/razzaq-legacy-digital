-- Create quotation status enum
CREATE TYPE public.quotation_status AS ENUM ('pending', 'accepted', 'declined');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('picking', 'ready', 'dispatched', 'completed');

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number TEXT NOT NULL UNIQUE,
  party_name TEXT NOT NULL,
  party_address TEXT,
  vehicle_number TEXT,
  comments TEXT,
  status quotation_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotation items table
CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create active orders table (for accepted quotations)
CREATE TABLE public.active_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE UNIQUE,
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'picking',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items (with picked checkbox)
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.active_orders(id) ON DELETE CASCADE,
  quotation_item_id UUID REFERENCES public.quotation_items(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_picked BOOLEAN NOT NULL DEFAULT false,
  picked_at TIMESTAMP WITH TIME ZONE,
  picked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for quotations
CREATE POLICY "Admins can view all quotations"
  ON public.quotations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quotations"
  ON public.quotations FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quotations"
  ON public.quotations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for quotation_items
CREATE POLICY "Admins can view all quotation items"
  ON public.quotation_items FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quotation items"
  ON public.quotation_items FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quotation items"
  ON public.quotation_items FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quotation items"
  ON public.quotation_items FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for active_orders
CREATE POLICY "Admins can view all active orders"
  ON public.active_orders FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert active orders"
  ON public.active_orders FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update active orders"
  ON public.active_orders FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete active orders"
  ON public.active_orders FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for order_items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update order items"
  ON public.order_items FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete order items"
  ON public.order_items FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to generate quotation number
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_number INTEGER;
  new_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 4) AS INTEGER)), 0) + 1
  INTO max_number
  FROM public.quotations;
  
  new_number := 'QUO' || LPAD(max_number::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_number INTEGER;
  new_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO max_number
  FROM public.active_orders;
  
  new_number := 'ORD' || LPAD(max_number::TEXT, 5, '0');
  
  RETURN new_number;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_active_orders_updated_at
  BEFORE UPDATE ON public.active_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();