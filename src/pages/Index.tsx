import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { TeacherManager } from '@/components/TeacherManager';
import { WeeklyMealTable } from '@/components/WeeklyMealTable';
import { MonthlySummary } from '@/components/MonthlySummary';
import { useMealTracker } from '@/hooks/useMealTracker';
import { getStartOfWeek } from '@/lib/dateUtils';
import { useState } from 'react';

const Index = () => {
  const {
    teachers,
    mealRecords,
    addTeacher,
    removeTeacher,
    setMealRecord,
    getMealRecord,
    getWeekRecords,
    getMonthlyTotal,
    getTeacherMonthlyTotal,
  } = useMealTracker();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getStartOfWeek(new Date()));

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <StatsCards
          teachers={teachers}
          mealRecords={mealRecords}
          currentMonth={currentMonth}
          currentYear={currentYear}
          getMonthlyTotal={getMonthlyTotal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyMealTable
              teachers={teachers}
              weekStart={currentWeekStart}
              onWeekChange={handleWeekChange}
              getMealRecord={getMealRecord}
              setMealRecord={setMealRecord}
              getWeekRecords={getWeekRecords}
            />
          </div>
          <div className="space-y-6">
            <TeacherManager
              teachers={teachers}
              addTeacher={addTeacher}
              removeTeacher={removeTeacher}
            />
            <MonthlySummary
              teachers={teachers}
              currentMonth={currentMonth}
              currentYear={currentYear}
              getTeacherMonthlyTotal={getTeacherMonthlyTotal}
              getMonthlyTotal={getMonthlyTotal}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
