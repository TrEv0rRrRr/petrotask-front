import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';

@Component({
  selector: 'app-incident-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    InputComponent,
    SelectorComponent,
    ButtonComponent,
  ],
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.scss'],
})
export class IncidentReportComponent {
  incidentForm: FormGroup;
  attachedFiles: File[] = [];
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.incidentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      type: ['', Validators.required],
      files: [null],
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.attachedFiles.push(file);
      }
    }
  }

  submitReport() {
    if (this.incidentForm.valid) {
      this.submitted = true;
      const formData = new FormData();
      formData.append('title', this.incidentForm.get('title')?.value);
      formData.append(
        'description',
        this.incidentForm.get('description')?.value
      );
      formData.append('type', this.incidentForm.get('type')?.value);
      for (let file of this.attachedFiles) {
        formData.append('files', file);
      }

      // Aquí iría la llamada al servicio para enviar el reporte
      // Por ejemplo: this.incidentService.create(formData).subscribe(...)
    } else {
      this.incidentForm.markAllAsTouched();
    }
  }
}
