import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerComponent } from './date-picker.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatePickerComponent,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit date when changed', () => {
    spyOn(component.dateSelected, 'emit');
    const testDate = new Date();
    
    component.onDateChange({ value: testDate });
    
    expect(component.dateSelected.emit).toHaveBeenCalledWith(testDate);
  });

  it('should mark as touched when date changes', () => {
    spyOn(component, 'markAsTouched');
    const testDate = new Date();
    
    component.onDateChange({ value: testDate });
    
    expect(component.markAsTouched).toHaveBeenCalled();
  });
  
  it('should have default backgroundColor value', () => {
    expect(component.backgroundColor).toBe('white');
  });
  
  it('should accept custom backgroundColor value', () => {
    component.backgroundColor = '#f5f5f5';
    expect(component.backgroundColor).toBe('#f5f5f5');
  });
  
});
