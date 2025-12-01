import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Task, TaskStatus } from '../../../planning/model/task.entity';
import { TaskService } from '../../../planning/services/task.service';
import { TaskAssignDialogComponent } from '../../components/task-assign-dialog/task-assign-dialog.component';
import { TaskCreateDialogComponent } from '../../components/task-create-dialog/task-create-dialog.component';

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
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss'],
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  // Filtros
  statusFilter: string = 'all';
  assignedFilter: string = 'all';

  // Columnas de la tabla
  displayedColumns: string[] = [
    'title',
    'status',
    'employeeId',
    'description',
    'actions',
  ];

  // Estadísticas del dashboard
  dashboardStats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  };

  constructor(private dialog: MatDialog, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.updateDashboardStats();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.updateDashboardStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.error =
          'Error al cargar las tareas. Por favor intenta nuevamente.';
        this.loading = false;
      },
    });
  }

  // US01: Crear tareas
  createTask(): void {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newTask = new Task(
          0,
          result.title,
          result.description,
          'PENDING',
          result.employeeId || 0,
          result.activityId
        );

        this.taskService.createTask(newTask).subscribe({
          next: (createdTask) => {
            this.tasks.unshift(createdTask);
            this.updateDashboardStats();
          },
          error: (error) => {
            console.error('Error creating task:', error);
          },
        });
      }
    });
  }

  // US02: Asignar tareas
  assignTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskAssignDialogComponent, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.employeeId) {
        this.taskService
          .updateTaskEmployeeId(task.taskId, result.employeeId)
          .subscribe({
            next: (updatedTask) => {
              const index = this.tasks.findIndex(
                (t) => t.taskId === task.taskId
              );
              if (index !== -1) {
                this.tasks[index] = updatedTask;
              }
              this.updateDashboardStats();
            },
            error: (error) => {
              console.error('Error assigning task:', error);
            },
          });
      }
    });
  }

  // US03: Reprogramar tareas
  rescheduleTask(task: Task): void {
    // Implementar lógica de reprogramación
  }

  // US04: Visualizar dashboard
  updateDashboardStats(): void {
    this.dashboardStats = {
      total: this.tasks.length,
      pending: this.tasks.filter((t) => t.status === 'PENDING').length,
      inProgress: this.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      completed: this.tasks.filter((t) => t.status === 'COMPLETED').length,
      cancelled: this.tasks.filter((t) => t.status === 'CANCELLED').length,
    };
  }

  getFilteredTasks(): Task[] {
    console.log('Filtering tasks. Total tasks:', this.tasks.length);
    console.log('Status filter:', this.statusFilter);
    console.log('Assigned filter:', this.assignedFilter);

    const filtered = this.tasks.filter((task) => {
      console.log('Task:', task);
      console.log('Task status:', task.status);
      console.log('Task employeeId:', task.employeeId);

      const statusMatch =
        this.statusFilter === 'all' ||
        task.status === this.statusFilter.toUpperCase();
      const assignedMatch =
        this.assignedFilter === 'all' ||
        (this.assignedFilter === 'assigned' && task.employeeId > 0) ||
        (this.assignedFilter === 'unassigned' && task.employeeId === 0);

      return statusMatch && assignedMatch;
    });

    return filtered;
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'PENDING':
        return '';
      case 'IN_PROGRESS':
        return 'accent';
      case 'COMPLETED':
        return 'primary';
      case 'CANCELLED':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'IN_PROGRESS':
        return 'play_circle';
      case 'COMPLETED':
        return 'check_circle';
      case 'CANCELLED':
        return 'block';
      default:
        return 'help';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getEmployeeName(employeeId: number): string {
    return employeeId > 0 ? `Empleado #${employeeId}` : 'Sin asignar';
  }
}
