import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MONTHS } from '@/types/meal';

interface MonthYearFilterProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onReset: () => void;
}

export function MonthYearFilter({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  onReset,
}: MonthYearFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const isCurrentPeriod =
    selectedMonth === new Date().getMonth() + 1 &&
    selectedYear === currentYear;

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Filter Periode:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => onMonthChange(parseInt(value))}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {MONTHS.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => onYearChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isCurrentPeriod && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="h-9"
              >
                Hari Ini
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
