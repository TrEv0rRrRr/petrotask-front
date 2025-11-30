import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Team } from '../../models/team.entity';
import { Employee } from '../../models/employee.entity';
import { Zone } from '../../models/zone.entity';
import { BaseFormComponent, FormConfig } from '../../../../shared/components/base-form/base-form.component';
import { EmployeeService } from '../../services/employee.service';
import { ZoneService } from '../../services/zone.service';
import { UiService } from '../../../../core/services/ui.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    MatDialogModule,
    TranslateModule,
    BaseFormComponent
  ],
  templateUrl: './team-form-dialog.component.html',
  styleUrl: './team-form-dialog.component.scss'
})
export class TeamFormDialogComponent implements OnInit {
  formConfig: FormConfig = { fields: [] };
  initialValues: any = {};
  isSubmitting = false;
  employees: Employee[] = [];
  zones: Zone[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeamFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamDialogData,
    private employeeService: EmployeeService,
    private zoneService: ZoneService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupForm();
  }

  private loadData(): void {
    // Load employees and zones in parallel
    forkJoin({
      employees: this.employeeService.getAllEmployees(),
      zones: this.zoneService.getAllZones()
    })
    .pipe(
      catchError(error => {
        console.error('Error loading data:', error);
        this.uiService.showSnackbar({
          message: 'Error loading data',
          type: 'error'
        });
        return of({ employees: [], zones: [] });
      })
    )
    .subscribe(({ employees, zones }) => {
      this.employees = employees;
      this.zones = zones;
      this.updateFormConfig();
    });
  }

  private setupForm(): void {
    this.initialValues = {
      name: this.data.team?.name || ''
    };
  }

  private updateFormConfig(): void {
    this.formConfig = {
      fields: [
        {
          key: 'name',
          type: 'text',
          labelKey: 'team.form.name',
          label: 'Team Name',
          placeholderKey: 'team.form.placeholders.name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100
          }
        }
      ],
      submitButtonTextKey: this.data.isEdit ? 'common.update' : 'common.create',
      cancelButtonTextKey: 'common.cancel',
      showCancelButton: true,
      layout: 'vertical',
      size: 'medium'
    };
  }

  onFormSubmit(formValue: any): void {
    this.isSubmitting = true;
    
    const teamData: Team = new Team(
      this.data.isEdit ? this.data.team?.id || 0 : 0,
      this.data.team?.tenantId || 1, // Default tenant ID
      formValue.name,
      this.data.team?.members || []
    );

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(teamData);
    }, 1000);
  }

  onFormCancel(): void {
    this.dialogRef.close();
  }
}
