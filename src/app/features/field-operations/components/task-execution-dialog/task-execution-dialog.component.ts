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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

export interface TaskExecutionData {
  task: any;
  action: 'start' | 'complete' | 'photo';
}

export interface PhotoData {
  url: string;
  description: string;
  category: 'before' | 'during' | 'after' | 'incident';
}

@Component({
  selector: 'app-task-execution-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './task-execution-dialog.component.html',
  styleUrls: ['./task-execution-dialog.component.scss'],
})
export class TaskExecutionDialogComponent {
  executionForm: FormGroup;
  action: string;
  task: any;
  selectedFile: File | null = null;
  photoPreview: string | null = null;

  // Opciones para categorías de fotos
  photoCategories = [
    { value: 'before', label: 'Antes de iniciar' },
    { value: 'during', label: 'Durante la ejecución' },
    { value: 'after', label: 'Después de completar' },
    { value: 'incident', label: 'Evidencia de incidencia' },
  ];

  // Checklist de seguridad
  safetyChecklist: Array<{ id: string; label: string; checked: boolean }> = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskExecutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskExecutionData
  ) {
    this.action = data.action;
    this.task = data.task;

    this.executionForm = this.fb.group({
      notes: [''],
      photoDescription: [''],
      photoCategory: ['during'],
      safetyConfirmed: [false, Validators.requiredTrue],
      equipmentChecked: [false, Validators.requiredTrue],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.photoPreview = null;
  }

  onSafetyItemChange(itemId: string, checked: boolean): void {
    const item = this.safetyChecklist.find((i) => i.id === itemId);
    if (item) {
      item.checked = checked;
    }
  }

  getSafetyProgress(): number {
    const checkedItems = this.safetyChecklist.filter(
      (item) => item.checked
    ).length;
    return (checkedItems / this.safetyChecklist.length) * 100;
  }

  allSafetyItemsChecked(): boolean {
    return this.safetyChecklist.every((item) => item.checked);
  }

  onSubmit(): void {
    if (this.executionForm.valid) {
      const formData = this.executionForm.value;
      let result: any = {
        action: this.action,
        notes: formData.notes,
        safetyConfirmed: formData.safetyConfirmed,
        equipmentChecked: formData.equipmentChecked,
        safetyChecklist: this.safetyChecklist.filter((item) => item.checked),
      };

      if (this.action === 'photo' && this.selectedFile) {
        // Simular subida de archivo
        result.photo = {
          url: this.photoPreview,
          description: formData.photoDescription,
          category: formData.photoCategory,
        };
      }

      this.dialogRef.close(result);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.executionForm.controls).forEach((key) => {
        this.executionForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getActionTitle(): string {
    switch (this.action) {
      case 'start':
        return 'Iniciar Tarea';
      case 'complete':
        return 'Completar Tarea';
      case 'photo':
        return 'Agregar Evidencia Fotográfica';
      default:
        return 'Ejecutar Tarea';
    }
  }

  getActionIcon(): string {
    switch (this.action) {
      case 'start':
        return 'play_arrow';
      case 'complete':
        return 'check_circle';
      case 'photo':
        return 'camera_alt';
      default:
        return 'assignment';
    }
  }

  getActionColor(): string {
    switch (this.action) {
      case 'start':
        return 'primary';
      case 'complete':
        return 'accent';
      case 'photo':
        return 'primary';
      default:
        return 'primary';
    }
  }
}
