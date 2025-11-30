import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface IncidentReportData {
  task: any;
}

export interface IncidentData {
  type: 'safety' | 'equipment' | 'environmental' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  photos: string[];
  immediateAction: string;
  reportedBy: string;
  timestamp: Date;
}

@Component({
  selector: 'app-incident-report-dialog',
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
    MatCheckboxModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './incident-report-dialog.component.html',
  styleUrls: ['./incident-report-dialog.component.scss']
})
export class IncidentReportDialogComponent {
  incidentForm: FormGroup;
  task: any;
  selectedFiles: File[] = [];
  photoPreviews: string[] = [];
  
  // Opciones para tipos de incidencia
  incidentTypes = [
    { value: 'safety', label: 'Seguridad', icon: 'security', color: 'warn' },
    { value: 'equipment', label: 'Equipo', icon: 'build', color: 'accent' },
    { value: 'environmental', label: 'Ambiental', icon: 'eco', color: 'primary' },
    { value: 'other', label: 'Otro', icon: 'help', color: '' }
  ];

  // Opciones para severidad
  severityLevels = [
    { value: 'low', label: 'Baja', description: 'Sin riesgo inmediato', color: 'primary' },
    { value: 'medium', label: 'Media', description: 'Requiere atención', color: 'accent' },
    { value: 'high', label: 'Alta', description: 'Riesgo significativo', color: 'warn' },
    { value: 'critical', label: 'Crítica', description: 'Emergencia inmediata', color: 'warn' }
  ];

  // Acciones inmediatas sugeridas
  immediateActions = [
    'Detener operaciones en el área',
    'Evacuar personal del área afectada',
    'Activar protocolo de emergencia',
    'Contactar supervisor inmediatamente',
    'Aislar el área afectada',
    'Verificar estado del equipo',
    'Documentar condiciones actuales',
    'Esperar instrucciones del supervisor'
  ];

  currentDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IncidentReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IncidentReportData
  ) {
    this.task = data.task;
    
    this.incidentForm = this.fb.group({
      type: ['', Validators.required],
      severity: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      immediateAction: ['', Validators.required],
      customAction: [''],
      location: [this.task?.location || '', Validators.required],
      reportedBy: ['Operario Actual', Validators.required], // En una app real vendría del servicio de auth
      emergencyContact: [false],
      supervisorNotified: [false]
    });
  }

  onFilesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
    
    // Crear previews de las imágenes
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }

  onImmediateActionChange(action: string): void {
    this.incidentForm.patchValue({ immediateAction: action });
  }

  getSelectedTypeInfo() {
    const type = this.incidentForm.get('type')?.value;
    return this.incidentTypes.find(t => t.value === type);
  }

  getSelectedSeverityInfo() {
    const severity = this.incidentForm.get('severity')?.value;
    return this.severityLevels.find(s => s.value === severity);
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      const formData = this.incidentForm.value;
      const result: IncidentData = {
        type: formData.type,
        severity: formData.severity,
        description: formData.description,
        photos: this.photoPreviews,
        immediateAction: formData.immediateAction,
        reportedBy: formData.reportedBy,
        timestamp: new Date()
      };

      this.dialogRef.close(result);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.incidentForm.controls).forEach(key => {
        this.incidentForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const field = this.incidentForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  isEmergency(): boolean {
    const severity = this.incidentForm.get('severity')?.value;
    return severity === 'critical' || this.incidentForm.get('emergencyContact')?.value;
  }
}
