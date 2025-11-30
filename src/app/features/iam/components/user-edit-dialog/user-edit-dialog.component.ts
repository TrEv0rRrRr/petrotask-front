import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '../../models/user.entity';
import { Roles } from '../../models/roles.enum';

interface RoleOption {
  value: Roles;
  label: string;
  description: string;
}

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
  imports: [
    TranslatePipe,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  standalone: true
})
export class UserEditDialogComponent {
  form: FormGroup;
  
  roleOptions: RoleOption[] = [
    {
      value: Roles.Admin,
      label: 'Administrador',
      description: 'Acceso completo al sistema'
    },
    {
      value: Roles.FieldSupervisor,
      label: 'Supervisor de Campo',
      description: 'Supervisión de operaciones petroleras'
    },
    {
      value: Roles.FieldOperator,
      label: 'Operario de Campo',
      description: 'Operaciones básicas petroleras'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.form = this.fb.group({
      username: [data.username, [Validators.required, Validators.minLength(3)]],
      firstName: [data.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [data.lastName, [Validators.required, Validators.minLength(2)]],
      email: [data.email, [Validators.required, Validators.email]],
      roles: [data.roles, Validators.required],
      status: [data.status]
    });
  }

  getRoleLabel(roleValue: Roles): string {
    const role = this.roleOptions.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  }

  getFullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`.trim();
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const updatedUser = new User(
        this.data.id,
        formValue.username,
        formValue.email,
        formValue.firstName,
        formValue.lastName,
        formValue.roles,
        formValue.status
      );
      
      this.dialogRef.close(updatedUser);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Ingrese un email válido';
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: {[key: string]: string} = {
      'username': 'Nombre de usuario',
      'firstName': 'Nombre',
      'lastName': 'Apellido',
      'email': 'Correo electrónico',
      'roles': 'Roles'
    };
    return labels[fieldName] || fieldName;
  }
} 