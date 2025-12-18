-- Drop and recreate the check constraints to match actual types
ALTER TABLE public.teachers DROP CONSTRAINT teachers_role_check;
ALTER TABLE public.teachers ADD CONSTRAINT teachers_role_check CHECK (role IN ('kepala_sekolah', 'guru', 'tendik', 'nakes', 'kepala_komite'));

ALTER TABLE public.meal_records DROP CONSTRAINT meal_records_meal_type_check;
ALTER TABLE public.meal_records ADD CONSTRAINT meal_records_meal_type_check CHECK (meal_type = 'siang');