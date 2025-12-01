import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Team } from '../../models/team.entity';

export interface TeamDialogData {
  team: Team;
  title: string;
  isEdit: boolean;
  selectedDate?: Date;
}

@Component({
  selector: 'app-team-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './team-form-dialog.component.html',
  styleUrl: './team-form-dialog.component.scss',
})
export class TeamFormDialogComponent implements OnInit {
  teamForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeamFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamDialogData
  ) {
    this.teamForm = this.fb.group({
      name: [
        this.data.team?.name || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    console.log('Form submitted with values:', this.teamForm.value);
    this.isSubmitting = true;

    const teamData: Team = new Team(
      this.data.isEdit ? this.data.team?.id || 0 : 0,
      this.data.team?.tenantId || 1,
      this.teamForm.value.name,
      this.data.team?.members || []
    );

    console.log('Team data created:', teamData);
    this.isSubmitting = false;
    this.dialogRef.close(teamData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
