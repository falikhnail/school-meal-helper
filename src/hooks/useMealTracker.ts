import { useState, useEffect, useCallback } from 'react';
import { Teacher, MealRecord, MealType, MEAL_PRICES } from '@/types/meal';
import { getWeekNumber, getStartOfWeek, formatDateKey } from '@/lib/dateUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useMealTracker() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers')
          .select('*')
          .order('created_at', { ascending: true });

        if (teachersError) throw teachersError;

        const formattedTeachers: Teacher[] = (teachersData || []).map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role as Teacher['role'],
        }));
        setTeachers(formattedTeachers);

        // Load meal records
        const { data: recordsData, error: recordsError } = await supabase
          .from('meal_records')
          .select('*');

        if (recordsError) throw recordsError;

        const formattedRecords: MealRecord[] = (recordsData || []).map((r) => {
          const date = new Date(r.date);
          return {
            id: r.id,
            teacherId: r.teacher_id,
            date: r.date,
            mealType: r.meal_type as MealType,
            week: getWeekNumber(date),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            cost: MEAL_PRICES[r.meal_type as MealType],
          };
        });
        setMealRecords(formattedRecords);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat data dari database',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addTeacher = useCallback(async (name: string, role: Teacher['role']) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert({ name, role })
        .select()
        .single();

      if (error) throw error;

      const newTeacher: Teacher = {
        id: data.id,
        name: data.name,
        role: data.role as Teacher['role'],
      };
      setTeachers((prev) => [...prev, newTeacher]);
      return newTeacher;
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan guru',
        variant: 'destructive',
      });
      return null;
    }
  }, []);

  const removeTeacher = useCallback(async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);

      if (error) throw error;

      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      setMealRecords((prev) => prev.filter((r) => r.teacherId !== teacherId));
    } catch (error) {
      console.error('Error removing teacher:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus guru',
        variant: 'destructive',
      });
    }
  }, []);

  const updateTeacher = useCallback(async (teacherId: string, updates: Partial<Omit<Teacher, 'id'>>) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', teacherId);

      if (error) throw error;

      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, ...updates } : t))
      );
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengupdate guru',
        variant: 'destructive',
      });
    }
  }, []);

  const setMealRecord = useCallback(async (
    teacherId: string,
    date: Date,
    mealType: MealType | null
  ) => {
    const dateKey = formatDateKey(date);
    const week = getWeekNumber(date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    try {
      if (!mealType) {
        // Delete existing record
        const { error } = await supabase
          .from('meal_records')
          .delete()
          .eq('teacher_id', teacherId)
          .eq('date', dateKey);

        if (error) throw error;

        setMealRecords((prev) =>
          prev.filter((r) => !(r.teacherId === teacherId && r.date === dateKey))
        );
      } else {
        // Upsert record
        const { data, error } = await supabase
          .from('meal_records')
          .upsert(
            { teacher_id: teacherId, date: dateKey, meal_type: mealType },
            { onConflict: 'teacher_id,date' }
          )
          .select()
          .single();

        if (error) throw error;

        const newRecord: MealRecord = {
          id: data.id,
          teacherId,
          date: dateKey,
          mealType,
          week,
          month,
          year,
          cost: MEAL_PRICES[mealType],
        };

        setMealRecords((prev) => {
          const filtered = prev.filter(
            (r) => !(r.teacherId === teacherId && r.date === dateKey)
          );
          return [...filtered, newRecord];
        });
      }
    } catch (error) {
      console.error('Error setting meal record:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan catatan makan',
        variant: 'destructive',
      });
    }
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
    isLoading,
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
