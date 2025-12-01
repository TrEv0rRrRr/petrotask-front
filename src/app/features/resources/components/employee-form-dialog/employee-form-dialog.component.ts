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
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiService } from '../../../../core/services/ui.service';
import { Employee } from '../../models/employee.entity';
import { Position } from '../../models/position.entity';
import { PositionService } from '../../services/position.service';

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
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './employee-form-dialog.component.html',
  styleUrl: './employee-form-dialog.component.scss',
})
export class EmployeeFormDialogComponent implements OnInit {
  employeeForm: FormGroup;
  positions: Position[] = [];
  isSubmitting = false;

  statusOptions = [
    { value: 'Available', label: 'Disponible' },
    { value: 'Vacation', label: 'En Vacaciones' },
    { value: 'Reserved', label: 'Reservado' },
    { value: 'Unavailable', label: 'No Disponible' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private positionService: PositionService,
    private uiService: UiService
  ) {
    this.employeeForm = this.fb.group({
      name: [
        this.data.employee.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        this.data.employee.lastName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        this.data.employee.email || '',
        [Validators.required, Validators.email],
      ],
      phoneNumber: [
        this.data.employee.phoneNumber || '',
        [Validators.required],
      ],
      positionId: [
        this.data.employee.positionId || null,
        [Validators.required],
      ],
      status: [this.data.employee.status || 'Available', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPositions();
  }

  private loadPositions(): void {
    this.positionService
      .getAllPositions()
      .pipe(
        catchError((error) => {
          console.error('Error loading positions:', error);
          this.uiService.showSnackbar({
            message: `Error cargando posiciones: ${
              error.status || 'Sin conexión'
            } - ${error.message || 'Verifica que el backend esté activo'}`,
            type: 'error',
          });
          return of([]);
        })
      )
      .subscribe((positions) => {
        console.log('Positions loaded:', positions);
        if (positions.length === 0) {
          this.uiService.showSnackbar({
            message:
              'No hay posiciones registradas. Por favor, crea posiciones primero.',
            type: 'warning',
          });
        }
        this.positions = positions;
      });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    console.log('Form submitted with values:', this.employeeForm.value);
    this.isSubmitting = true;

    const formValue = this.employeeForm.value;
    const employeeData: Employee = new Employee(
      this.data.isEdit ? this.data.employee.id : 0,
      this.data.employee.tenantId || 1,
      formValue.name,
      formValue.lastName,
      formValue.positionId,
      this.getPositionTitle(formValue.positionId),
      formValue.status,
      formValue.email,
      formValue.phoneNumber
    );

    console.log('Employee data created:', employeeData);
    this.isSubmitting = false;
    this.dialogRef.close(employeeData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private getPositionTitle(positionId: number): string {
    const position = this.positions.find((p) => p.id === positionId);
    return position ? position.title : '';
  }
}
