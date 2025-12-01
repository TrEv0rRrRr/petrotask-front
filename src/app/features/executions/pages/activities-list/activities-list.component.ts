import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../../planning/model/task.entity';
import { TaskService } from '../../../planning/services/task.service';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss',
})
export class ActivitiesListComponent implements OnInit {
  currentTab = 0;
  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';
  selectedCategory = '';

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;

  // Estadísticas
  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  overdueTasks = 0;

  // Filtros
  statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completado' },
    { value: 'CANCELLED', label: 'Cancelado' },
  ];

  priorityOptions = [
    { value: '', label: 'Todas las Prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' },
  ];

  categoryOptions = [
    { value: '', label: 'Todas las Categorías' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Inspección', label: 'Inspección' },
    { value: 'Calibración', label: 'Calibración' },
    { value: 'Limpieza', label: 'Limpieza' },
    { value: 'Reparación', label: 'Reparación' },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = [...this.tasks];
        this.calculateStatistics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.error = 'Error al cargar las tareas';
        this.loading = false;
      },
    });
  }

  calculateStatistics(): void {
    this.totalTasks = this.tasks.length;
    this.pendingTasks = this.tasks.filter((t) => t.status === 'PENDING').length;
    this.inProgressTasks = this.tasks.filter(
      (t) => t.status === 'IN_PROGRESS'
    ).length;
    this.completedTasks = this.tasks.filter(
      (t) => t.status === 'COMPLETED'
    ).length;
    this.overdueTasks = 0; // El modelo Task no tiene dueDate
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch =
        !this.searchTerm ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || task.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'accent';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'primary';
      case 'CANCELLED':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'IN_PROGRESS':
        return 'play_circle';
      case 'COMPLETED':
        return 'check_circle';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  }

  viewTaskDetails(task: Task): void {
    // Navigate to task details
    this.router.navigate(['/petrotask/task-management']);
  }

  editTask(task: Task): void {
    // Navigate to edit task
    this.router.navigate(['/petrotask/task-management']);
  }

  assignTask(task: Task): void {
    // Navigate to assign task
    this.router.navigate(['/petrotask/task-management']);
  }

  getFilteredTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter((task) => task.status === status);
  }
}
