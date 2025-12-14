import { Users, Utensils, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, getMonthName } from '@/lib/dateUtils';
import { Teacher, MealRecord } from '@/types/meal';

interface StatsCardsProps {
  teachers: Teacher[];
  mealRecords: MealRecord[];
  currentMonth: number;
  currentYear: number;
  getMonthlyTotal: (month: number, year: number) => number;
}

export function StatsCards({
  teachers,
  mealRecords,
  currentMonth,
  currentYear,
  getMonthlyTotal,
}: StatsCardsProps) {
  const monthlyTotal = getMonthlyTotal(currentMonth, currentYear);
  const monthlyRecordCount = mealRecords.filter(
    (r) => r.month === currentMonth && r.year === currentYear
  ).length;

  const stats = [
    {
      label: 'Total Guru',
      value: teachers.length.toString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Data Makan Bulan Ini',
      value: monthlyRecordCount.toString(),
      icon: Utensils,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: getMonthName(currentMonth),
      value: currentYear.toString(),
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Total Iuran Bulan Ini',
      value: formatCurrency(monthlyTotal),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="animate-fade-in border-border/50 hover:shadow-md transition-shadow"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
