-- Create monthly_payments table to replace weekly_payments
CREATE TABLE public.monthly_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, month, year)
);

-- Enable RLS
ALTER TABLE public.monthly_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view monthly_payments" 
ON public.monthly_payments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert monthly_payments" 
ON public.monthly_payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update monthly_payments" 
ON public.monthly_payments 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete monthly_payments" 
ON public.monthly_payments 
FOR DELETE 
USING (true);