import { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Teacher, ROLE_LABELS } from '@/types/meal';
import { formatCurrency, getMonthName } from '@/lib/dateUtils';

interface ReminderBannerProps {
  teachers: Teacher[];
  month: number;
  year: number;
  getTeacherMonthlyTotal: (teacherId: string, month: number, year: number) => number;
  getMonthlyPayment: (teacherId: string, month: number, year: number) => { isPaid: boolean } | undefined;
}

export function ReminderBanner({
  teachers,
  month,
  year,
  getTeacherMonthlyTotal,
  getMonthlyPayment,
}: ReminderBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Find teachers with unpaid meals
  const unpaidTeachers = teachers.filter((teacher) => {
    const total = getTeacherMonthlyTotal(teacher.id, month, year);
    const payment = getMonthlyPayment(teacher.id, month, year);
    return total > 0 && !payment?.isPaid;
  });

  const totalUnpaid = unpaidTeachers.reduce(
    (sum, t) => sum + getTeacherMonthlyTotal(t.id, month, year),
    0
  );

  if (dismissed || unpaidTeachers.length === 0) return null;

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-orange-500/10 shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">
                🔔 Pengingat Pembayaran — {getMonthName(month)} {year}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-orange-600">{unpaidTeachers.length} guru</span> belum lunas dengan total{' '}
                <span className="font-semibold text-orange-600">{formatCurrency(totalUnpaid)}</span>
              </p>

              {expanded && (
                <div className="mt-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                  {unpaidTeachers.map((teacher) => {
                    const total = getTeacherMonthlyTotal(teacher.id, month, year);
                    return (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between text-sm py-1.5 px-2 rounded bg-orange-500/5"
                      >
                        <div className="min-w-0">
                          <span className="font-medium text-foreground truncate block">{teacher.name}</span>
                          <span className="text-xs text-muted-foreground">{ROLE_LABELS[teacher.role]}</span>
                        </div>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30 shrink-0 ml-2">
                          {formatCurrency(total)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-orange-600 hover:text-orange-700 px-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Lihat detail ({unpaidTeachers.length} guru)
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
