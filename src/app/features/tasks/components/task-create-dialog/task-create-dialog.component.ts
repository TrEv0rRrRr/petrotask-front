import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Activity } from '../../../planning/model/activity.entity';
import { ActivityService } from '../../../planning/services/activity.service';

@Component({
  selector: 'app-task-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.scss'],
})
export class TaskCreateDialogComponent {
  taskForm: FormGroup;
  activities: Activity[] = [];

  statusOptions = [
    { value: 'Pending', label: 'Pendiente' },
    { value: 'InProgress', label: 'En Progreso' },
    { value: 'Completed', label: 'Completada' },
    { value: 'Cancelled', label: 'Cancelada' },
  ];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    public dialogRef: MatDialogRef<TaskCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      activityId: ['', Validators.required],
      employeeId: [0, [Validators.required, Validators.min(0)]],
      status: ['Pending', Validators.required],
    });

    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.activities = [];
      },
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    } else {
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `Valor mínimo: ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Valor máximo: ${field.errors['max'].max}`;
      }
    }
    return '';
  }
}
