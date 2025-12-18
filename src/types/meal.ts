export type TeacherRole = 'kepala_sekolah' | 'guru' | 'tendik' | 'nakes' | 'kepala_komite';

export const ROLE_LABELS: Record<TeacherRole, string> = {
  kepala_sekolah: 'Kepala Sekolah',
  guru: 'Guru',
  tendik: 'Tendik',
  nakes: 'Nakes',
  kepala_komite: 'Kepala Komite',
};

export type MealType = 'siang';

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

export interface WeeklyPayment {
  id: string;
  teacherId: string;
  weekNumber: number;
  year: number;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
}

export const MEAL_PRICES = {
  siang: 10000,
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
