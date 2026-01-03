import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { TeacherManager } from '@/components/TeacherManager';
import { MonthlyMealTable } from '@/components/MonthlyMealTable';
import { MonthlySummary } from '@/components/MonthlySummary';
import { MonthYearFilter } from '@/components/MonthYearFilter';
import { useMealTracker } from '@/hooks/useMealTracker';
import { useState } from 'react';

const Index = () => {
  const {
    teachers,
    mealRecords,
    isLoading,
    addTeacher,
    removeTeacher,
    setMealRecord,
    getMealRecord,
    getMonthRecords,
    getMonthlyTotal,
    getTeacherMonthlyTotal,
    getMonthlyPayment,
    setMonthlyPaymentStatus,
  } = useMealTracker();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleResetFilter = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <MonthYearFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onReset={handleResetFilter}
        />
        <StatsCards
          teachers={teachers}
          mealRecords={mealRecords}
          currentMonth={selectedMonth}
          currentYear={selectedYear}
          getMonthlyTotal={getMonthlyTotal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyMealTable
              teachers={teachers}
              month={selectedMonth}
              year={selectedYear}
              getMealRecord={getMealRecord}
              setMealRecord={setMealRecord}
              getMonthRecords={getMonthRecords}
              getMonthlyPayment={getMonthlyPayment}
              setMonthlyPaymentStatus={setMonthlyPaymentStatus}
              getTeacherMonthlyTotal={getTeacherMonthlyTotal}
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
              currentMonth={selectedMonth}
              currentYear={selectedYear}
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
