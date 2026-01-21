import { useState } from 'react';
import { Sun, Search, FileDown, Check, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Teacher, MealRecord, MealType, MEAL_PRICES, ROLE_LABELS } from '@/types/meal';
import {
  getMonthDates,
  formatCurrency,
  getMonthName,
} from '@/lib/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_FILTERS = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
  { value: 0, label: 'Minggu' },
];

interface MonthlyPayment {
  id: string;
  teacherId: string;
  month: number;
  year: number;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
}

interface MonthlyMealTableProps {
  teachers: Teacher[];
  month: number;
  year: number;
  getMealRecord: (teacherId: string, date: Date) => MealRecord | undefined;
  setMealRecord: (teacherId: string, date: Date, mealType: MealType | null) => Promise<void>;
  getMonthRecords: (month: number, year: number) => MealRecord[];
  getMonthlyPayment: (teacherId: string, month: number, year: number) => MonthlyPayment | undefined;
  setMonthlyPaymentStatus: (teacherId: string, month: number, year: number, amount: number, isPaid: boolean) => Promise<void>;
  getTeacherMonthlyTotal: (teacherId: string, month: number, year: number) => number;
}

export function MonthlyMealTable({
  teachers,
  month,
  year,
  getMealRecord,
  setMealRecord,
  getMonthRecords,
  getMonthlyPayment,
  setMonthlyPaymentStatus,
  getTeacherMonthlyTotal,
}: MonthlyMealTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default Senin-Jumat
  
  const allMonthDates = getMonthDates(month, year);
  const monthDates = allMonthDates.filter(date => selectedDays.includes(date.getDay()));
  const monthRecords = getMonthRecords(month, year);
  const monthTotal = monthRecords.reduce((sum, r) => sum + r.cost, 0);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ROLE_LABELS[teacher.role].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
    );
  };

  const selectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const selectAllDays = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };

  const handlePaymentToggle = async (teacher: Teacher) => {
    const total = getTeacherMonthlyTotal(teacher.id, month, year);
    const currentPayment = getMonthlyPayment(teacher.id, month, year);
    const newIsPaid = !currentPayment?.isPaid;
    await setMonthlyPaymentStatus(teacher.id, month, year, total, newIsPaid);
  };

  const DAY_NAMES_FULL = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const exportToPDF = () => {
    if (teachers.length === 0) {
      alert('Tidak ada data guru untuk di-export. Tambahkan guru terlebih dahulu.');
      return;
    }

    const doc = new jsPDF('landscape');
    const monthName = getMonthName(month);

    // Use ALL dates for export (not filtered), to match total calculations
    const exportDates = allMonthDates;

    // Title
    doc.setFontSize(16);
    doc.text(`Data Makan Bulanan - ${monthName} ${year}`, 14, 15);

    // Create date headers with day names
    const dateHeaders = exportDates.map(date => {
      const dayName = DAY_NAMES_FULL[date.getDay()].substring(0, 3);
      return `${dayName}\n${date.getDate()}`;
    });

    // Headers: Nama, Keterangan, [dates...], Total, Status
    const headers = ['Nama', 'Ket.', ...dateHeaders, 'Total', 'Status'];

    // Table data with meal records for each date
    const tableData = teachers.map((teacher) => {
      const teacherTotal = getTeacherMonthlyTotal(teacher.id, month, year);
      const payment = getMonthlyPayment(teacher.id, month, year);
      
      // Create meal status for each date
      const mealStatuses = exportDates.map(date => {
        const record = getMealRecord(teacher.id, date);
        return record ? '✓' : '-';
      });
      
      return [
        teacher.name,
        ROLE_LABELS[teacher.role].substring(0, 8),
        ...mealStatuses,
        formatCurrency(teacherTotal),
        payment?.isPaid ? 'Lunas' : 'Belum',
      ];
    });

    // Dynamic column styles
    const columnStyles: { [key: string]: object } = {
      '0': { cellWidth: 30 },
      '1': { cellWidth: 15, halign: 'center' },
    };
    
    // Date columns - smaller for all days
    exportDates.forEach((_, index) => {
      columnStyles[String(index + 2)] = { cellWidth: 7, halign: 'center' };
    });
    
    // Total and Status columns
    columnStyles[String(exportDates.length + 2)] = { cellWidth: 22, halign: 'right', fontStyle: 'bold' };
    columnStyles[String(exportDates.length + 3)] = { cellWidth: 12, halign: 'center' };

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 22,
      styles: { fontSize: 5, cellPadding: 1 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, halign: 'center', fontSize: 4 },
      columnStyles,
      foot: [[
        { content: 'Total Bulan Ini:', colSpan: exportDates.length + 2, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: formatCurrency(monthTotal), styles: { halign: 'right', fontStyle: 'bold' } },
        { content: '', styles: {} },
      ]],
    });

    doc.save(`data-makan-${monthName}-${year}.pdf`);
  };

  // Calculate paid and unpaid totals
  const paidTotal = filteredTeachers.reduce((sum, teacher) => {
    const payment = getMonthlyPayment(teacher.id, month, year);
    if (payment?.isPaid) {
      return sum + getTeacherMonthlyTotal(teacher.id, month, year);
    }
    return sum;
  }, 0);

  const unpaidTotal = monthTotal - paidTotal;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Data Makan Bulanan
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getMonthName(month)} {year}
              </p>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Hari ({selectedDays.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 flex gap-2">
                  <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs" onClick={selectWeekdays}>
                    Sen-Jum
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs" onClick={selectAllDays}>
                    Semua
                  </Button>
                </div>
                {DAY_FILTERS.map((day) => (
                  <DropdownMenuCheckboxItem
                    key={day.value}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground sticky left-0 bg-card z-10 min-w-[140px]">
                      Nama
                    </th>
                    {monthDates.map((date) => (
                      <th
                        key={date.toISOString()}
                        className="text-center py-3 px-1 text-sm font-medium text-muted-foreground min-w-[40px]"
                      >
                        <div className="text-[10px] text-muted-foreground/70">{DAY_NAMES[date.getDay()]}</div>
                        <div className="text-xs">{date.getDate()}</div>
                      </th>
                    ))}
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground min-w-[90px]">
                      Total
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground min-w-[100px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => {
                    const teacherMonthTotal = getTeacherMonthlyTotal(teacher.id, month, year);
                    const payment = getMonthlyPayment(teacher.id, month, year);
                    const isPaid = payment?.isPaid || false;

                    return (
                      <tr key={teacher.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-2 sticky left-0 bg-card z-10">
                          <div className="font-medium text-foreground text-sm">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {ROLE_LABELS[teacher.role]}
                          </div>
                        </td>
                        {monthDates.map((date) => {
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
                                  className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${teacherMonthTotal > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                            {formatCurrency(teacherMonthTotal)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {teacherMonthTotal > 0 ? (
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
                    <td colSpan={monthDates.length + 1} className="py-3 px-2 text-right font-semibold text-foreground">
                      Total Bulan Ini:
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-lg font-bold text-success">
                        {formatCurrency(monthTotal)}
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
