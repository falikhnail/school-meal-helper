import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Teacher, ROLE_LABELS } from '@/types/meal';
import { formatCurrency, getMonthName } from '@/lib/dateUtils';
import { Receipt, TrendingUp } from 'lucide-react';

interface MonthlySummaryProps {
  teachers: Teacher[];
  currentMonth: number;
  currentYear: number;
  getTeacherMonthlyTotal: (teacherId: string, month: number, year: number) => number;
  getMonthlyTotal: (month: number, year: number) => number;
}

export function MonthlySummary({
  teachers,
  currentMonth,
  currentYear,
  getTeacherMonthlyTotal,
  getMonthlyTotal,
}: MonthlySummaryProps) {
  const monthlyTotal = getMonthlyTotal(currentMonth, currentYear);

  const teacherTotals = teachers
    .map((teacher) => ({
      teacher,
      total: getTeacherMonthlyTotal(teacher.id, currentMonth, currentYear),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Ringkasan {getMonthName(currentMonth)} {currentYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada data untuk ditampilkan</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {teacherTotals.map(({ teacher, total }, index) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_LABELS[teacher.role]}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${total > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between p-4 rounded-xl gradient-success">
                <div className="flex items-center gap-2 text-success-foreground">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Total Bulan Ini</span>
                </div>
                <span className="text-xl font-bold text-success-foreground">
                  {formatCurrency(monthlyTotal)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
