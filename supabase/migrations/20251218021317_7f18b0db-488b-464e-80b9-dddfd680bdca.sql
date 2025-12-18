-- Create weekly_payments table to track payment status
CREATE TABLE public.weekly_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, week_number, year)
);

-- Enable RLS
ALTER TABLE public.weekly_payments ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Anyone can view weekly_payments" ON public.weekly_payments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert weekly_payments" ON public.weekly_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update weekly_payments" ON public.weekly_payments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete weekly_payments" ON public.weekly_payments FOR DELETE USING (true);

-- Create indexes
CREATE INDEX idx_weekly_payments_teacher_id ON public.weekly_payments(teacher_id);
CREATE INDEX idx_weekly_payments_week_year ON public.weekly_payments(week_number, year);