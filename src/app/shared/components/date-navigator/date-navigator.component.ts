import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-date-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DatePickerComponent
  ],
  templateUrl: './date-navigator.component.html',
  styleUrl: './date-navigator.component.scss'
})
export class DateNavigatorComponent implements OnInit {
  @Input() selectedDate: Date = new Date();
  @Output() dateChange = new EventEmitter<Date>();

  daysOfWeek: { date: Date, dayOfWeek: string, dayNumber: number, isSelected: boolean }[] = [];
  
  ngOnInit(): void {
    this.generateDaysOfWeek();
  }

  generateDaysOfWeek(): void {
    this.daysOfWeek = [];
    const currentDate = new Date(this.selectedDate);
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    // Generate days of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      this.daysOfWeek.push({
        date: date,
        dayOfWeek: this.getDayOfWeekName(date.getDay()),
        dayNumber: date.getDate(),
        isSelected: this.isSameDay(date, this.selectedDate)
      });
    }
  }

  getDayOfWeekName(day: number): string {
    const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    return days[day];
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    this.dateChange.emit(this.selectedDate);
    this.daysOfWeek.forEach(day => {
      day.isSelected = this.isSameDay(day.date, this.selectedDate);
    });
  }

  navigateToPreviousWeek(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    this.selectedDate = newDate;
    this.generateDaysOfWeek();
    this.dateChange.emit(this.selectedDate);
  }

  navigateToNextWeek(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    this.selectedDate = newDate;
    this.generateDaysOfWeek();
    this.dateChange.emit(this.selectedDate);
  }

  onDatePickerChange(event: Date): void {
    this.selectedDate = event;
    this.generateDaysOfWeek();
    this.dateChange.emit(this.selectedDate);
  }
}
