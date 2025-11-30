import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskCreateDialogComponent } from '../../components/task-create-dialog/task-create-dialog.component';
import { TaskAssignDialogComponent } from '../../components/task-assign-dialog/task-assign-dialog.component';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  assignedTeam?: string;
  location: string;
  scheduledDate: Date;
  estimatedDuration: number; // en horas
  actualDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  resources: string[];
  tags: string[];
}

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {
  // Datos de ejemplo para las tareas
  tasks: Task[] = [
    {
      id: '1',
      title: 'Inspección de Válvulas de Seguridad',
      description: 'Verificar el funcionamiento de todas las válvulas de seguridad en la plataforma Alpha',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Juan Pérez',
      location: 'Plataforma Alpha - Sector Norte',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
      estimatedDuration: 4,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      createdBy: 'Supervisor Carlos',
      resources: ['Multímetro', 'Kit de herramientas', 'EPP'],
      tags: ['Seguridad', 'Mantenimiento', 'Crítico']
    },
    {
      id: '2',
      title: 'Cambio de Filtros en Compresor',
      description: 'Reemplazar filtros de aire en el compresor principal C-001',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'María González',
      location: 'Planta de Procesamiento - Área 2',
      scheduledDate: new Date(),
      estimatedDuration: 2,
      actualDuration: 1.5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      createdBy: 'Supervisor Carlos',
      resources: ['Filtros nuevos', 'Herramientas especializadas'],
      tags: ['Mantenimiento', 'Preventivo']
    },
    {
      id: '3',
      title: 'Verificación de Presión en Líneas',
      description: 'Medir presión en todas las líneas principales del sistema',
      priority: 'critical',
      status: 'pending',
      location: 'Campo Beta - Pozo 15',
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // En 2 horas
      estimatedDuration: 6,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      createdBy: 'Supervisor Ana',
      resources: ['Manómetros', 'Válvulas de prueba', 'EPP'],
      tags: ['Seguridad', 'Crítico', 'Verificación']
    }
  ];

  // Filtros
  statusFilter: string = 'all';
  priorityFilter: string = 'all';
  assignedFilter: string = 'all';

  // Columnas de la tabla
  displayedColumns: string[] = ['title', 'priority', 'status', 'assignedTo', 'location', 'scheduledDate', 'actions'];

  // Estadísticas del dashboard
  dashboardStats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    blocked: 0
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateDashboardStats();
  }

  // US01: Crear tareas
  createTask(): void {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTask: Task = {
          id: this.generateTaskId(),
          ...result,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'Usuario Actual' // En una app real vendría del servicio de auth
        };
        this.tasks.unshift(newTask);
        this.updateDashboardStats();
      }
    });
  }

  // US02: Asignar tareas
  assignTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskAssignDialogComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        task.assignedTo = result.assignedTo;
        task.assignedTeam = result.assignedTeam;
        task.status = 'assigned';
        task.updatedAt = new Date();
        this.updateDashboardStats();
      }
    });
  }

  // US03: Reprogramar tareas
  rescheduleTask(task: Task): void {
    // Implementar lógica de reprogramación
    console.log('Reprogramando tarea:', task.id);
  }

  // US04: Visualizar dashboard
  updateDashboardStats(): void {
    this.dashboardStats = {
      total: this.tasks.length,
      pending: this.tasks.filter(t => t.status === 'pending').length,
      inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      blocked: this.tasks.filter(t => t.status === 'blocked').length
    };
  }

  getFilteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const statusMatch = this.statusFilter === 'all' || task.status === this.statusFilter;
      const priorityMatch = this.priorityFilter === 'all' || task.priority === this.priorityFilter;
      const assignedMatch = this.assignedFilter === 'all' || 
        (this.assignedFilter === 'assigned' && task.assignedTo) ||
        (this.assignedFilter === 'unassigned' && !task.assignedTo);
      
      return statusMatch && priorityMatch && assignedMatch;
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'warn';
      case 'high': return 'accent';
      case 'medium': return 'primary';
      case 'low': return '';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '';
      case 'assigned': return 'primary';
      case 'in-progress': return 'accent';
      case 'completed': return 'primary';
      case 'blocked': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'assigned': return 'assignment_ind';
      case 'in-progress': return 'play_circle';
      case 'completed': return 'check_circle';
      case 'blocked': return 'block';
      default: return 'help';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'check_circle';
      default: return 'help';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private generateTaskId(): string {
    return 'TASK-' + Date.now().toString(36).toUpperCase();
  }
}
