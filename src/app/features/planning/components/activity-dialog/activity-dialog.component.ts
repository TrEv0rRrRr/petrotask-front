import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Activity } from '../../model/activity.entity';
import { Task } from '../../model/task.entity';

interface DialogData {
  activity?: Activity;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss'],
})
export class ActivityDialogComponent implements OnInit {
  activityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.activityForm = this.fb.group({
      activityCode: ['', Validators.required],
      description: ['', Validators.required],
      expectedTime: [new Date(), Validators.required],
      weekNumber: [
        1,
        [Validators.required, Validators.min(1), Validators.max(52)],
      ],
      activityStatus: ['PLANNED', Validators.required],
      locationOrigin: [0, [Validators.required, Validators.min(1)]],
      locationDestination: [0, [Validators.required, Validators.min(1)]],
      zoneOrigin: [0, [Validators.required, Validators.min(1)]],
      zoneDestination: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    if (this.data.activity) {
      this.activityForm.patchValue({
        activityCode: this.data.activity.activityCode,
        description: this.data.activity.description,
        expectedTime: new Date(this.data.activity.expectedTime),
        weekNumber: this.data.activity.weekNumber,
        activityStatus: this.data.activity.activityStatus,
        locationOrigin: this.data.activity.locationOrigin,
        locationDestination: this.data.activity.locationDestination,
        zoneOrigin: this.data.activity.zoneOrigin,
        zoneDestination: this.data.activity.zoneDestination,
      });
    }
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      const formValue = this.activityForm.value;
      const activity: Activity = new Activity(
        this.data.activity?.id || 0,
        formValue.activityCode,
        formValue.description,
        formValue.expectedTime,
        formValue.weekNumber,
        formValue.activityStatus,
        formValue.zoneOrigin,
        formValue.locationOrigin,
        formValue.zoneDestination,
        formValue.locationDestination
      );
      this.dialogRef.close(activity);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
