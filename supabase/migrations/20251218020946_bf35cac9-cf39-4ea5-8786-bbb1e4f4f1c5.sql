-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guru', 'piketpagi', 'piketsore')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_records table
CREATE TABLE public.meal_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'both')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, date)
);

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;

-- Allow public access to teachers
CREATE POLICY "Anyone can view teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update teachers" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete teachers" ON public.teachers FOR DELETE USING (true);

-- Allow public access to meal_records
CREATE POLICY "Anyone can view meal_records" ON public.meal_records FOR SELECT USING (true);
CREATE POLICY "Anyone can insert meal_records" ON public.meal_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update meal_records" ON public.meal_records FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete meal_records" ON public.meal_records FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_meal_records_teacher_id ON public.meal_records(teacher_id);
CREATE INDEX idx_meal_records_date ON public.meal_records(date);