import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BaseFormComponent, FormConfig, FormField } from '../../../../shared/components/base-form/base-form.component';
import { SelectOption } from '../../../../shared/components/form-selector/form-selector.component';
import { User } from '../../models/user.entity';
import { Roles } from '../../models/roles.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create-dialog',
  templateUrl: './user-create-dialog.component.html',
  styleUrls: ['./user-create-dialog.component.scss'],
  imports: [
    TranslateModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    BaseFormComponent
  ],
  standalone: true
})
export class UserCreateDialogComponent {
  isSubmitting = false;
  
  // Opciones para el selector de roles
  roleOptions: SelectOption[] = [
    {
      value: Roles.Admin,
      label: 'Administrador'
    },
    {
      value: Roles.FieldSupervisor,
      label: 'Supervisor de Campo'
    },
    {
      value: Roles.FieldOperator,
      label: 'Operario de Campo'
    }
  ];

  // Configuración del formulario usando nuestra nueva implementación
  formConfig: FormConfig = {
    fields: [
      {
        key: 'username',
        type: 'text',
        label: 'Nombre de usuario',
        labelKey: 'user-create-dialog.username',
        required: true,
        validation: {
          minLength: 3,
          maxLength: 50
        }
      },
      {
        key: 'firstName',
        type: 'text',
        label: 'Nombre',
        labelKey: 'user-create-dialog.firstName',
        required: true
      },
      {
        key: 'lastName',
        type: 'text',
        label: 'Apellido',
        labelKey: 'user-create-dialog.lastName',
        required: true
      },
      {
        key: 'email',
        type: 'email',
        label: 'Correo electrónico',
        labelKey: 'user-create-dialog.email',
        required: true
      },
      {
        key: 'password',
        type: 'password',
        label: 'Contraseña',
        labelKey: 'user-create-dialog.password',
        required: true,
        validation: {
          minLength: 8
        }
      },
      {
        key: 'roles',
        type: 'select',
        label: 'Roles',
        labelKey: 'user-create-dialog.roles',
        required: true,
        multiple: true,
        options: [
          { value: Roles.Admin, label: 'Administrador' },
          { value: Roles.FieldSupervisor, label: 'Supervisor de Campo' },
          { value: Roles.FieldOperator, label: 'Operario de Campo' }
        ]
      },
      {
        key: 'status',
        type: 'select',
        label: 'Estado',
        labelKey: 'user-create-dialog.status',
        required: true,
        options: [
          { value: 'active', label: 'Activo' },
          { value: 'inactive', label: 'Inactivo' },
          { value: 'pending', label: 'Pendiente' }
        ]
      },

    ],
    submitButtonText: 'Crear usuario',
    submitButtonTextKey: 'user-create-dialog.create',
    cancelButtonText: 'Cancelar',
    cancelButtonTextKey: 'common.cancel',
    showCancelButton: true,
    layout: 'vertical',
    size: 'medium'
  };

  // Datos iniciales del formulario
  initialValues: any = {};



  constructor(
    private dialogRef: MatDialogRef<UserCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Inicializar valores si vienen del data
    if (this.data) {
      this.initialValues = { ...this.data };
    }
  }

  // Manejar envío del formulario
  onFormSubmit(formValue: any): void {
    this.isSubmitting = true;
    
    // Procesar datos del formulario
    
    // Simular envío
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(formValue);
    }, 2000);
  }

  // Manejar cancelación del formulario
  onFormCancel(): void {
    this.dialogRef.close();
  }

  // Manejar cambios del formulario (opcional)
  onFormChange(formValue: any): void {
  }


} 
