import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Employee } from '../../models/employee.entity';
import { Position } from '../../models/position.entity';
import { PositionService } from '../../services/position.service';
import { BaseFormComponent, FormConfig, FormField } from '../../../../shared/components/base-form/base-form.component';
import { UiService } from '../../../../core/services/ui.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface EmployeeDialogData {
  employee: Employee;
  title: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    BaseFormComponent
  ],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.scss'
})
export class EmployeeFormDialogComponent implements OnInit {
  formConfig: FormConfig = { fields: [] };
  initialValues: any = {};
  isSubmitting = false;
  positions: Position[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private positionService: PositionService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.loadPositions();
    this.setupForm();
  }

  private loadPositions(): void {
    this.positionService.getAllPositions()
      .pipe(
        catchError(error => {
          console.error('Error loading positions:', error);
          this.uiService.showSnackbar({
            message: 'Error loading positions',
            type: 'error'
          });
          return of([]);
        })
      )
      .subscribe(positions => {
        this.positions = positions;
        this.updateFormConfig();
      });
  }

  private setupForm(): void {
    this.initialValues = {
      name: this.data.employee.name || '',
      lastName: this.data.employee.lastName || '',
      email: this.data.employee.email || '',
      phoneNumber: this.data.employee.phoneNumber || '',
      positionId: this.data.employee.positionId || null,
      status: this.data.employee.status || 'ACTIVE'
    };
  }

  private updateFormConfig(): void {
    const positionOptions = this.positions.map(position => ({
      value: position.id,
      label: position.title
    }));

    this.formConfig = {
      fields: [
        {
          key: 'name',
          type: 'text',
          labelKey: 'employee.form.name',
          label: 'Name',
          placeholderKey: 'employee.form.placeholders.name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          }
        },
        {
          key: 'lastName',
          type: 'text',
          labelKey: 'employee.form.lastName',
          label: 'Last Name',
          placeholderKey: 'employee.form.placeholders.lastName',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          }
        },
        {
          key: 'email',
          type: 'email',
          labelKey: 'employee.form.email',
          label: 'Email',
          placeholderKey: 'employee.form.placeholders.email',
          required: true,
          validation: {
            maxLength: 100
          }
        },
        {
          key: 'phoneNumber',
          type: 'text',
          labelKey: 'employee.form.phoneNumber',
          label: 'Phone Number',
          placeholderKey: 'employee.form.placeholders.phoneNumber',
          required: true,
          validation: {
            pattern: '^[+]?[0-9\\s\\-\\(\\)]{8,20}$'
          },
          customErrorMessages: {
            pattern: 'Please enter a valid phone number'
          }
        },
        {
          key: 'positionId',
          type: 'select',
          labelKey: 'employee.form.position',
          label: 'Position',
          placeholderKey: 'employee.form.placeholders.position',
          required: true,
          options: positionOptions
        },
        {
          key: 'status',
          type: 'select',
          labelKey: 'employee.form.status',
          label: 'Status',
          required: true,
          options: [
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
            { value: 'ON_LEAVE', label: 'On Leave' }
          ]
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
    
    const employeeData: Employee = new Employee(
      this.data.isEdit ? this.data.employee.id : 0,
      this.data.employee.tenantId || 1, // Default tenant ID
      formValue.name,
      formValue.lastName,
      formValue.positionId,
      this.getPositionTitle(formValue.positionId),
      formValue.status,
      formValue.email,
      formValue.phoneNumber
    );

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(employeeData);
    }, 1000);
  }

  onFormCancel(): void {
    this.dialogRef.close();
  }

  private getPositionTitle(positionId: number): string {
    const position = this.positions.find(p => p.id === positionId);
    return position ? position.title : '';
  }
}
