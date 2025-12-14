import { useState, useEffect, useCallback } from 'react';
import { Teacher, MealRecord, MealType, MEAL_PRICES } from '@/types/meal';
import { getWeekNumber, getStartOfWeek, formatDateKey } from '@/lib/dateUtils';

const TEACHERS_STORAGE_KEY = 'meal-tracker-teachers';
const RECORDS_STORAGE_KEY = 'meal-tracker-records';

export function useMealTracker() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load from localStorage on mount
  useEffect(() => {
    const savedTeachers = localStorage.getItem(TEACHERS_STORAGE_KEY);
    const savedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);

    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    }
    if (savedRecords) {
      setMealRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(mealRecords));
  }, [mealRecords]);

  const addTeacher = useCallback((name: string, role: Teacher['role']) => {
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),
      name,
      role,
    };
    setTeachers((prev) => [...prev, newTeacher]);
    return newTeacher;
  }, []);

  const removeTeacher = useCallback((teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    setMealRecords((prev) => prev.filter((r) => r.teacherId !== teacherId));
  }, []);

  const updateTeacher = useCallback((teacherId: string, updates: Partial<Omit<Teacher, 'id'>>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, ...updates } : t))
    );
  }, []);

  const setMealRecord = useCallback((
    teacherId: string,
    date: Date,
    mealType: MealType | null
  ) => {
    const dateKey = formatDateKey(date);
    const week = getWeekNumber(date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    setMealRecords((prev) => {
      // Remove existing record for this teacher and date
      const filtered = prev.filter(
        (r) => !(r.teacherId === teacherId && r.date === dateKey)
      );

      // If mealType is null, just remove the record
      if (!mealType) {
        return filtered;
      }

      // Add new record
      const newRecord: MealRecord = {
        id: crypto.randomUUID(),
        teacherId,
        date: dateKey,
        mealType,
        week,
        month,
        year,
        cost: MEAL_PRICES[mealType],
      };

      return [...filtered, newRecord];
    });
  }, []);

  const getMealRecord = useCallback((teacherId: string, date: Date): MealRecord | undefined => {
    const dateKey = formatDateKey(date);
    return mealRecords.find(
      (r) => r.teacherId === teacherId && r.date === dateKey
    );
  }, [mealRecords]);

  const getWeekRecords = useCallback((weekStart: Date) => {
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      weekDates.push(formatDateKey(date));
    }
    return mealRecords.filter((r) => weekDates.includes(r.date));
  }, [mealRecords]);

  const getMonthlyTotal = useCallback((month: number, year: number) => {
    return mealRecords
      .filter((r) => r.month === month && r.year === year)
      .reduce((sum, r) => sum + r.cost, 0);
  }, [mealRecords]);

  const getTeacherMonthlyTotal = useCallback((teacherId: string, month: number, year: number) => {
    return mealRecords
      .filter((r) => r.teacherId === teacherId && r.month === month && r.year === year)
      .reduce((sum, r) => sum + r.cost, 0);
  }, [mealRecords]);

  const getCurrentWeekStart = useCallback(() => {
    return getStartOfWeek(selectedDate);
  }, [selectedDate]);

  return {
    teachers,
    mealRecords,
    selectedDate,
    setSelectedDate,
    addTeacher,
    removeTeacher,
    updateTeacher,
    setMealRecord,
    getMealRecord,
    getWeekRecords,
    getMonthlyTotal,
    getTeacherMonthlyTotal,
    getCurrentWeekStart,
  };
}
