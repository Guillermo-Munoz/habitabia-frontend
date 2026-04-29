import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Booking {
  checkIn: string;
  checkOut: string;
}

@Component({
  selector: 'app-booking-calendar',
  imports: [DatePipe],
  templateUrl: './booking-calendar.html',
  styleUrl: './booking-calendar.css',
})
export class BookingCalendar {

  @Input() bookedRanges: Booking[] = [];

  @Output() datesSelected = new EventEmitter<{ startDate: Date, endDate: Date }>();


  viewDate: Date = new Date();
  days: Date[] = this.getDaysInMonth();
  startDate: Date | null = null;
  endDate: Date | null = null;

  getDaysInMonth(): Date[]{
    return Array.from({ length: new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0).getDate() }, (_, i) => new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), i + 1));
  }
  getFirstDayOfMonth(): number {
    const day = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  }

  isBooked(date: Date): boolean {
    return this.bookedRanges.some(range => {
      const [y1, m1, d1] = range.checkIn.split('-').map(Number);
      const [y2, m2, d2] = range.checkOut.split('-').map(Number);
      const checkIn = new Date(y1, m1 - 1, d1);
      const checkOut = new Date(y2, m2 - 1, d2);
      return date >= checkIn && date <= checkOut;
    });
  }
  selectDate(date: Date): void {
    if (this.isBooked(date)) return;
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (date > this.startDate) {
      this.endDate = date;
      this.datesSelected.emit({ startDate: this.startDate!, endDate: date });
    } else {
      this.startDate = date;
    }
  }
  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.days = this.getDaysInMonth();
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.days = this.getDaysInMonth();
  }
  isSelected(date: Date): boolean {
    return (!!this.startDate && date.getTime() === this.startDate.getTime()) ||
           (!!this.endDate && date.getTime() === this.endDate.getTime());
  }

  isInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  get emptyDays(): number[] {
    return Array(this.getFirstDayOfMonth()).fill(0);
  }
  isPast(date: Date): boolean{
    const todate = new Date();
    todate.setHours(0,0,0,0);
    return date < todate;
  }


}
