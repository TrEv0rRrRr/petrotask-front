import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
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
import { Task } from '../../../planning/model/task.entity';

@Component({
  selector: 'app-task-assign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './task-assign-dialog.component.html',
  styleUrls: ['./task-assign-dialog.component.scss'],
})
export class TaskAssignDialogComponent {
  assignForm: FormGroup;
  task: Task;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.task = data.task;

    this.assignForm = this.fb.group({
      employeeId: [
        this.task.employeeId || 0,
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value);
    } else {
      Object.keys(this.assignForm.controls).forEach((key) => {
        this.assignForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const field = this.assignForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['min']) {
        return 'Debe ingresar un ID de empleado válido (mayor a 0)';
      }
    }
    return '';
  }
}
