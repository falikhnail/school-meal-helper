import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Search, FileDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Teacher, MealRecord, MealType, DAYS_OF_WEEK, MEAL_PRICES, ROLE_LABELS, WeeklyPayment } from '@/types/meal';
import {
  getWeekDates,
  getWeekNumber,
  formatDate,
  formatCurrency,
  getMonthName,
} from '@/lib/dateUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface WeeklyMealTableProps {
  teachers: Teacher[];
  weekStart: Date;
  onWeekChange: (direction: 'prev' | 'next') => void;
  getMealRecord: (teacherId: string, date: Date) => MealRecord | undefined;
  setMealRecord: (teacherId: string, date: Date, mealType: MealType | null) => Promise<void>;
  getWeekRecords: (weekStart: Date) => MealRecord[];
  getWeeklyPayment: (teacherId: string, weekNumber: number, year: number) => WeeklyPayment | undefined;
  setWeeklyPaymentStatus: (teacherId: string, weekNumber: number, year: number, amount: number, isPaid: boolean) => Promise<void>;
  getTeacherWeeklyTotal: (teacherId: string, weekStart: Date) => number;
}

export function WeeklyMealTable({
  teachers,
  weekStart,
  onWeekChange,
  getMealRecord,
  setMealRecord,
  getWeekRecords,
  getWeeklyPayment,
  setWeeklyPaymentStatus,
  getTeacherWeeklyTotal,
}: WeeklyMealTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const weekDates = getWeekDates(weekStart);
  const weekNumber = getWeekNumber(weekStart);
  const weekYear = weekStart.getFullYear();
  const weekRecords = getWeekRecords(weekStart);
  const weekTotal = weekRecords.reduce((sum, r) => sum + r.cost, 0);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ROLE_LABELS[teacher.role].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePaymentToggle = async (teacher: Teacher) => {
    const total = getTeacherWeeklyTotal(teacher.id, weekStart);
    const currentPayment = getWeeklyPayment(teacher.id, weekNumber, weekYear);
    const newIsPaid = !currentPayment?.isPaid;
    await setWeeklyPaymentStatus(teacher.id, weekNumber, weekYear, total, newIsPaid);
  };

  const exportToPDF = () => {
    if (teachers.length === 0) {
      alert('Tidak ada data guru untuk di-export. Tambahkan guru terlebih dahulu.');
      return;
    }

    const doc = new jsPDF('landscape');
    const monthName = getMonthName(weekStart.getMonth() + 1);
    const year = weekStart.getFullYear();

    // Title
    doc.setFontSize(16);
    doc.text(`Data Makan Mingguan - Minggu ke-${weekNumber}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`${monthName} ${year} | ${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`, 14, 22);

    // Table data
    const tableData = teachers.map((teacher) => {
      const row: string[] = [teacher.name, ROLE_LABELS[teacher.role]];
      let teacherTotal = 0;

      weekDates.forEach((date) => {
        const record = getMealRecord(teacher.id, date);
        if (record) {
          row.push('V');
          teacherTotal += record.cost;
        } else {
          row.push('-');
        }
      });

      row.push(formatCurrency(teacherTotal));
      
      const payment = getWeeklyPayment(teacher.id, weekNumber, weekYear);
      row.push(payment?.isPaid ? 'Lunas' : 'Belum');
      
      return row;
    });

    // Headers
    const headers = [
      'Nama',
      'Keterangan',
      ...DAYS_OF_WEEK.map((day, i) => `${day}\n${formatDate(weekDates[i])}`),
      'Total',
      'Status',
    ];

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 28,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        9: { halign: 'right', fontStyle: 'bold' },
        10: { halign: 'center' },
      },
      foot: [[
        { content: 'Total Minggu Ini:', colSpan: 9, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: formatCurrency(weekTotal), styles: { halign: 'right', fontStyle: 'bold' } },
        { content: '', styles: {} },
      ]],
    });

    doc.save(`data-makan-minggu-${weekNumber}-${monthName}-${year}.pdf`);
  };

  // Calculate paid and unpaid totals
  const paidTotal = filteredTeachers.reduce((sum, teacher) => {
    const payment = getWeeklyPayment(teacher.id, weekNumber, weekYear);
    if (payment?.isPaid) {
      return sum + getTeacherWeeklyTotal(teacher.id, weekStart);
    }
    return sum;
  }, 0);

  const unpaidTotal = weekTotal - paidTotal;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
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
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {teachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tambahkan guru terlebih dahulu untuk mengisi data makan</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tidak ada hasil untuk "{searchQuery}"</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground w-[140px]">
                      Nama
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
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground w-[90px]">
                      Total
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground w-[100px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => {
                    const teacherWeekTotal = getTeacherWeeklyTotal(teacher.id, weekStart);
                    const payment = getWeeklyPayment(teacher.id, weekNumber, weekYear);
                    const isPaid = payment?.isPaid || false;

                    return (
                      <tr key={teacher.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2">
                          <div className="font-medium text-foreground text-sm">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {ROLE_LABELS[teacher.role]}
                          </div>
                        </td>
                        {weekDates.map((date) => {
                          const record = getMealRecord(teacher.id, date);
                          const isChecked = !!record;
                          return (
                            <td key={date.toISOString()} className="py-2 px-1">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    setMealRecord(
                                      teacher.id,
                                      date,
                                      checked ? 'siang' : null
                                    );
                                  }}
                                  className="h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${teacherWeekTotal > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                            {formatCurrency(teacherWeekTotal)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {teacherWeekTotal > 0 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePaymentToggle(teacher)}
                              className={`h-7 px-2 ${isPaid ? 'text-green-600 hover:text-green-700' : 'text-orange-500 hover:text-orange-600'}`}
                            >
                              {isPaid ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                                  <Check className="w-3 h-3 mr-1" />
                                  Lunas
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                                  <X className="w-3 h-3 mr-1" />
                                  Belum
                                </Badge>
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
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
                    <td className="py-3 px-2 text-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-green-600">Lunas: {formatCurrency(paidTotal)}</span>
                        <span className="text-xs text-orange-500">Belum: {formatCurrency(unpaidTotal)}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sun className="w-3 h-3 text-primary" />
                <span>Siang = {formatCurrency(MEAL_PRICES.siang)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-green-600" />
                <span>Klik status untuk mengubah</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
