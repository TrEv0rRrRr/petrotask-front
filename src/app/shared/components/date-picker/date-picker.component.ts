import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Seleccionar fecha';
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() showCalendarIcon: boolean = true;
  @Input() calendarIconPosition: 'prefix' | 'suffix' = 'suffix';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() label: string = '';
  @Input() showLabel: boolean = false;
  @Input() backgroundColor: string = 'white';

  @Output() dateSelected = new EventEmitter<Date>();
  
  _value: Date | null = null;
  touched = false;
  
  // Control Value Accessor methods
  onChange: any = () => {};
  onTouched: any = () => {};
  
  get value(): Date | null {
    return this._value;
  }
  
  set value(val: Date | null) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
    if (val) {
      this.dateSelected.emit(val);
    }
  }
  
  writeValue(value: Date | null): void {
    if (value !== undefined) {
      this._value = value;
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onDateChange(event: any): void {
    this.value = event.value;
    this.markAsTouched();
  }
  
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
