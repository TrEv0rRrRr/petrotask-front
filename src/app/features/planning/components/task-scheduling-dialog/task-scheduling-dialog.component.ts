import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';
import { TaskProgramming } from '../../model/task-programming.entity';
import { Task } from '../../model/task.entity';

@Component({
  selector: 'app-task-scheduling-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './task-scheduling-dialog.component.html',
  styleUrl: './task-scheduling-dialog.component.scss',
})
export class TaskSchedulingDialogComponent implements OnInit {
  schedulingForm: FormGroup;
  availableResources: { id: number; name: string; type: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskSchedulingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: Task; scheduling?: TaskProgramming }
  ) {
    this.schedulingForm = this.fb.group({
      taskId: [{ value: '', disabled: true }],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      resourceType: ['EQUIPMENT', Validators.required],
      resourceId: [1, [Validators.required, Validators.min(1)]],
      status: ['PENDING', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAvailableResources();
    this.initFormValues();
  }

  loadAvailableResources(): void {
    // TODO: Get data from a service
    this.availableResources = [];
  }

  initFormValues(): void {
    if (this.data.scheduling) {
      // Editing existing scheduling
      const scheduling = this.data.scheduling;
      const startDate = scheduling.start || new Date();
      const endDate = scheduling.end || new Date();

      this.schedulingForm.patchValue({
        taskId: scheduling.taskId,
        startDate: startDate,
        startTime: this.formatTime(startDate),
        endDate: endDate,
        endTime: this.formatTime(endDate),
        resourceType: scheduling.resourceType || 'EQUIPMENT',
        resourceId: scheduling.resourceId || 1,
        status: scheduling.programmingStatus,
      });
    } else if (this.data.task) {
      // New scheduling for a task
      this.schedulingForm.patchValue({
        taskId: this.data.task.taskId,
      });
    }
  }

  formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5); // Format as HH:MM
  }

  onSubmit(): void {
    if (this.schedulingForm.valid) {
      const formValues = this.schedulingForm.value;

      // Combine date and time values
      const startDateTime = new Date(formValues.startDate);
      const startTimeParts = formValues.startTime.split(':');
      startDateTime.setHours(
        Number(startTimeParts[0]),
        Number(startTimeParts[1]),
        0,
        0
      );

      const endDateTime = new Date(formValues.endDate);
      const endTimeParts = formValues.endTime.split(':');
      endDateTime.setHours(
        Number(endTimeParts[0]),
        Number(endTimeParts[1]),
        0,
        0
      );

      // Create or update the task programming
      const taskProgramming = new TaskProgramming(
        this.data.scheduling?.taskProgrammingId || 0,
        this.data.scheduling?.reservationId || 0,
        formValues.status,
        this.data.task?.taskId || this.data.scheduling?.taskId,
        formValues.resourceType,
        formValues.resourceId,
        startDateTime,
        endDateTime
      );

      this.dialogRef.close(taskProgramming);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
