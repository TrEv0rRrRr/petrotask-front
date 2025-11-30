import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {SelectorComponent} from '../../../../shared/components/selector/selector.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';

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
    NgIf,
    ReactiveFormsModule,
    MatDivider,
    InputComponent,
    SelectorComponent,
    ButtonComponent
  ],
  templateUrl: './incident-report.component.html',
  styleUrls: ['./incident-report.component.scss']
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
      files: [null]
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
      formData.append('title', this.incidentForm.get('title')?.value); // 👈 Asegúrate de incluir 'title'
      formData.append('description', this.incidentForm.get('description')?.value);
      formData.append('type', this.incidentForm.get('type')?.value);
      for (let file of this.attachedFiles) {
        formData.append('files', file);
      }

      console.log('Formulario listo para enviar:', {
        ...this.incidentForm.value,
        files: this.attachedFiles
      });
    } else {
      this.incidentForm.markAllAsTouched();
    }
  }
}
