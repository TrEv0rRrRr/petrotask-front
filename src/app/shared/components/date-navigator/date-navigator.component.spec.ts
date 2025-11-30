import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateNavigatorComponent } from './date-navigator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

// Mock DatePickerComponent para simplificar las pruebas
@Component({
  selector: 'app-date-picker',
  template: '<div></div>'
})
class MockDatePickerComponent {
  @Input() ngModel: any;
  @Input() appearance: string = 'outline';
  @Input() readonly: boolean = false;
}

describe('DateNavigatorComponent', () => {
  let component: DateNavigatorComponent;
  let fixture: ComponentFixture<DateNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DateNavigatorComponent,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        FormsModule
      ],
      declarations: [
        MockDatePickerComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate days of week on initialization', () => {
    expect(component.daysOfWeek.length).toBe(7);
  });

  it('should navigate to previous week', () => {
    const initialDate = new Date(component.selectedDate);
    component.navigateToPreviousWeek();
    const newDate = component.selectedDate;
    
    // Calculate the difference in days
    const diffTime = initialDate.getTime() - newDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    
    expect(diffDays).toBe(7);
  });

  it('should navigate to next week', () => {
    const initialDate = new Date(component.selectedDate);
    component.navigateToNextWeek();
    const newDate = component.selectedDate;
    
    // Calculate the difference in days
    const diffTime = newDate.getTime() - initialDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    
    expect(diffDays).toBe(7);
  });
});
