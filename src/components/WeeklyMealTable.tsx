import { ChevronLeft, ChevronRight, Coffee, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Teacher, MealRecord, MealType, DAYS_OF_WEEK, MEAL_PRICES } from '@/types/meal';
import {
  getWeekDates,
  getWeekNumber,
  formatDate,
  formatCurrency,
  getMonthName,
} from '@/lib/dateUtils';

interface WeeklyMealTableProps {
  teachers: Teacher[];
  weekStart: Date;
  onWeekChange: (direction: 'prev' | 'next') => void;
  getMealRecord: (teacherId: string, date: Date) => MealRecord | undefined;
  setMealRecord: (teacherId: string, date: Date, mealType: MealType | null) => void;
  getWeekRecords: (weekStart: Date) => MealRecord[];
}

export function WeeklyMealTable({
  teachers,
  weekStart,
  onWeekChange,
  getMealRecord,
  setMealRecord,
  getWeekRecords,
}: WeeklyMealTableProps) {
  const weekDates = getWeekDates(weekStart);
  const weekNumber = getWeekNumber(weekStart);
  const weekRecords = getWeekRecords(weekStart);
  const weekTotal = weekRecords.reduce((sum, r) => sum + r.cost, 0);

  const getMealIcon = (mealType: MealType) => {
    switch (mealType) {
      case 'pagi':
        return <Coffee className="w-3 h-3" />;
      case 'siang':
        return <Sun className="w-3 h-3" />;
      case 'pagi_siang':
        return <Sparkles className="w-3 h-3" />;
    }
  };

  const getMealLabel = (mealType: MealType) => {
    switch (mealType) {
      case 'pagi':
        return 'Pagi';
      case 'siang':
        return 'Siang';
      case 'pagi_siang':
        return 'Pagi + Siang';
    }
  };

  const getMealColor = (mealType: MealType | undefined) => {
    if (!mealType) return '';
    switch (mealType) {
      case 'pagi':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'siang':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'pagi_siang':
        return 'bg-success/10 text-success border-success/20';
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Data Makan Mingguan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Minggu ke-{weekNumber} • {getMonthName(weekStart.getMonth() + 1)} {weekStart.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onWeekChange('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[80px] text-center">
              {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onWeekChange('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {teachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tambahkan guru terlebih dahulu untuk mengisi data makan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-[150px]">
                      Nama Guru
                    </th>
                    {weekDates.map((date, index) => (
                      <th
                        key={date.toISOString()}
                        className="text-center py-3 px-1 text-sm font-medium text-muted-foreground"
                      >
                        <div>{DAYS_OF_WEEK[index]}</div>
                        <div className="text-xs font-normal">{formatDate(date)}</div>
                      </th>
                    ))}
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground w-[100px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => {
                    const teacherWeekTotal = weekDates.reduce((sum, date) => {
                      const record = getMealRecord(teacher.id, date);
                      return sum + (record?.cost || 0);
                    }, 0);

                    return (
                      <tr key={teacher.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2">
                          <div className="font-medium text-foreground text-sm">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {teacher.role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Guru'}
                          </div>
                        </td>
                        {weekDates.map((date) => {
                          const record = getMealRecord(teacher.id, date);
                          return (
                            <td key={date.toISOString()} className="py-2 px-1">
                              <Select
                                value={record?.mealType || 'none'}
                                onValueChange={(value) => {
                                  setMealRecord(
                                    teacher.id,
                                    date,
                                    value === 'none' ? null : (value as MealType)
                                  );
                                }}
                              >
                                <SelectTrigger
                                  className={`h-8 text-xs border ${getMealColor(record?.mealType)} ${
                                    !record ? 'bg-muted/50' : ''
                                  }`}
                                >
                                  <SelectValue>
                                    {record ? (
                                      <span className="flex items-center gap-1">
                                        {getMealIcon(record.mealType)}
                                        <span className="hidden sm:inline">{getMealLabel(record.mealType)}</span>
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">-</span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                  <SelectItem value="none">
                                    <span className="text-muted-foreground">Tidak Makan</span>
                                  </SelectItem>
                                  <SelectItem value="pagi">
                                    <span className="flex items-center gap-2">
                                      <Coffee className="w-4 h-4 text-primary" />
                                      Pagi ({formatCurrency(MEAL_PRICES.pagi)})
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="siang">
                                    <span className="flex items-center gap-2">
                                      <Sun className="w-4 h-4 text-accent" />
                                      Siang ({formatCurrency(MEAL_PRICES.siang)})
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="pagi_siang">
                                    <span className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-success" />
                                      Pagi + Siang ({formatCurrency(MEAL_PRICES.pagi_siang)})
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          );
                        })}
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${teacherWeekTotal > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                            {formatCurrency(teacherWeekTotal)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={8} className="py-3 px-2 text-right font-semibold text-foreground">
                      Total Minggu Ini:
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-lg font-bold text-success">
                        {formatCurrency(weekTotal)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Coffee className="w-3 h-3 text-primary" />
                <span>Pagi = {formatCurrency(MEAL_PRICES.pagi)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sun className="w-3 h-3 text-accent" />
                <span>Siang = {formatCurrency(MEAL_PRICES.siang)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-success" />
                <span>Pagi + Siang = {formatCurrency(MEAL_PRICES.pagi_siang)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
