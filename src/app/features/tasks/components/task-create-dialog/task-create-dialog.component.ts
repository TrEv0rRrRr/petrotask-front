import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './task-create-dialog.component.html',
  styleUrls: ['./task-create-dialog.component.scss']
})
export class TaskCreateDialogComponent {
  taskForm: FormGroup;
  
  // Opciones para los selects
  priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  locationOptions = [
    'Plataforma Alpha - Sector Norte',
    'Plataforma Alpha - Sector Sur',
    'Planta de Procesamiento - Área 1',
    'Planta de Procesamiento - Área 2',
    'Planta de Procesamiento - Área 3',
    'Campo Beta - Pozo 10',
    'Campo Beta - Pozo 15',
    'Campo Beta - Pozo 20',
    'Estación de Bombeo Central',
    'Almacén de Materiales',
    'Taller de Mantenimiento'
  ];

  resourceOptions = [
    'Multímetro',
    'Kit de herramientas',
    'EPP (Equipo de Protección Personal)',
    'Manómetros',
    'Válvulas de prueba',
    'Herramientas especializadas',
    'Filtros nuevos',
    'Cables de conexión',
    'Detector de gases',
    'Termómetro digital',
    'Cámara de inspección',
    'Bomba de vacío'
  ];

  tagOptions = [
    'Seguridad',
    'Mantenimiento',
    'Crítico',
    'Preventivo',
    'Correctivo',
    'Verificación',
    'Inspección',
    'Calibración',
    'Limpieza',
    'Reparación',
    'Instalación',
    'Prueba'
  ];

  selectedResources: string[] = [];
  selectedTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      location: ['', Validators.required],
      scheduledDate: [new Date(), Validators.required],
      estimatedDuration: [1, [Validators.required, Validators.min(0.5), Validators.max(24)]]
    });
  }

  onResourceAdd(resource: string): void {
    if (resource && !this.selectedResources.includes(resource)) {
      this.selectedResources.push(resource);
    }
  }

  onResourceRemove(resource: string): void {
    this.selectedResources = this.selectedResources.filter(r => r !== resource);
  }

  onTagAdd(tag: string): void {
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }
  }

  onTagRemove(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      const taskData = {
        ...formData,
        resources: this.selectedResources,
        tags: this.selectedTags
      };
      
      this.dialogRef.close(taskData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.taskForm.controls).forEach(key => {
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
