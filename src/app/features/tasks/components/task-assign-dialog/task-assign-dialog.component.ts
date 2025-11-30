import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface Technician {
  id: string;
  name: string;
  skills: string[];
  currentTasks: number;
  availability: 'available' | 'busy' | 'offline';
  location: string;
}

interface Team {
  id: string;
  name: string;
  members: string[];
  specialization: string;
  currentTasks: number;
  availability: 'available' | 'busy' | 'offline';
}

@Component({
  selector: 'app-task-assign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './task-assign-dialog.component.html',
  styleUrls: ['./task-assign-dialog.component.scss']
})
export class TaskAssignDialogComponent {
  assignForm: FormGroup;
  assignmentType: 'individual' | 'team' = 'individual';
  
  // Datos de ejemplo para técnicos
  technicians: Technician[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      skills: ['Seguridad', 'Mantenimiento', 'Válvulas'],
      currentTasks: 2,
      availability: 'available',
      location: 'Plataforma Alpha'
    },
    {
      id: '2',
      name: 'María González',
      skills: ['Compresores', 'Sistemas de presión', 'Calibración'],
      currentTasks: 1,
      availability: 'available',
      location: 'Planta de Procesamiento'
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      skills: ['Inspección', 'Verificación', 'Reportes'],
      currentTasks: 3,
      availability: 'busy',
      location: 'Campo Beta'
    },
    {
      id: '4',
      name: 'Ana Martínez',
      skills: ['Seguridad', 'Emergencias', 'Primeros auxilios'],
      currentTasks: 0,
      availability: 'available',
      location: 'Estación Central'
    }
  ];

  // Datos de ejemplo para equipos
  teams: Team[] = [
    {
      id: '1',
      name: 'Equipo de Mantenimiento Alpha',
      members: ['Juan Pérez', 'María González'],
      specialization: 'Mantenimiento Preventivo',
      currentTasks: 3,
      availability: 'available'
    },
    {
      id: '2',
      name: 'Equipo de Seguridad Beta',
      members: ['Ana Martínez', 'Carlos Rodríguez'],
      specialization: 'Inspecciones de Seguridad',
      currentTasks: 1,
      availability: 'available'
    },
    {
      id: '3',
      name: 'Equipo de Emergencias',
      members: ['Ana Martínez', 'Juan Pérez', 'María González'],
      specialization: 'Respuesta a Emergencias',
      currentTasks: 0,
      availability: 'available'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.assignForm = this.fb.group({
      assignmentType: ['individual', Validators.required],
      assignedTo: ['', Validators.required],
      assignedTeam: [''],
      notes: ['']
    });

    // Suscribirse a cambios en el tipo de asignación
    this.assignForm.get('assignmentType')?.valueChanges.subscribe(value => {
      this.assignmentType = value;
      if (value === 'individual') {
        this.assignForm.get('assignedTeam')?.clearValidators();
        this.assignForm.get('assignedTo')?.setValidators([Validators.required]);
      } else {
        this.assignForm.get('assignedTo')?.clearValidators();
        this.assignForm.get('assignedTeam')?.setValidators([Validators.required]);
      }
      this.assignForm.get('assignedTo')?.updateValueAndValidity();
      this.assignForm.get('assignedTeam')?.updateValueAndValidity();
    });
  }

  getAvailableTechnicians(): Technician[] {
    return this.technicians.filter(tech => tech.availability === 'available');
  }

  getAvailableTeams(): Team[] {
    return this.teams.filter(team => team.availability === 'available');
  }

  getTechnicianById(id: string): Technician | undefined {
    return this.technicians.find(tech => tech.id === id);
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(team => team.id === id);
  }

  getAvailabilityIcon(availability: string): string {
    switch (availability) {
      case 'available': return 'check_circle';
      case 'busy': return 'schedule';
      case 'offline': return 'offline_bolt';
      default: return 'help';
    }
  }

  getAvailabilityColor(availability: string): string {
    switch (availability) {
      case 'available': return 'primary';
      case 'busy': return 'accent';
      case 'offline': return 'warn';
      default: return '';
    }
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      const formData = this.assignForm.value;
      let assignmentData: any = {
        assignmentType: formData.assignmentType,
        notes: formData.notes
      };

      if (formData.assignmentType === 'individual') {
        const technician = this.getTechnicianById(formData.assignedTo);
        assignmentData.assignedTo = technician?.name;
        assignmentData.assignedToId = formData.assignedTo;
      } else {
        const team = this.getTeamById(formData.assignedTeam);
        assignmentData.assignedTeam = team?.name;
        assignmentData.assignedTeamId = formData.assignedTeam;
      }

      this.dialogRef.close(assignmentData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.assignForm.controls).forEach(key => {
        this.assignForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
