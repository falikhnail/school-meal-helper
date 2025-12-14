export type TeacherRole = 'kepala_sekolah' | 'guru';

export type MealType = 'pagi' | 'siang' | 'pagi_siang';

export interface Teacher {
  id: string;
  name: string;
  role: TeacherRole;
}

export interface MealRecord {
  id: string;
  teacherId: string;
  date: string; // ISO date string
  mealType: MealType;
  week: number;
  month: number;
  year: number;
  cost: number;
}

export interface WeeklyMealData {
  week: number;
  month: number;
  year: number;
  records: MealRecord[];
  totalCost: number;
}

export const MEAL_PRICES = {
  pagi: 10000,
  siang: 10000,
  pagi_siang: 20000,
} as const;

export const DAYS_OF_WEEK = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
] as const;

export const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;
