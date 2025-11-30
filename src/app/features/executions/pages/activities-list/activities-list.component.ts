import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  location: string;
  dueDate: Date;
  createdDate: Date;
  progress: number;
  category: string;
  estimatedHours: number;
  actualHours?: number;
}

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
    TranslateModule
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent implements OnInit {
  currentTab = 0;
  searchTerm = '';
  selectedStatus = '';
  selectedPriority = '';
  selectedCategory = '';

  // Datos de ejemplo
  tasks: Task[] = [
    {
      id: '1',
      title: 'Mantenimiento Preventivo Bomba B-301',
      description: 'Realizar mantenimiento preventivo completo en bomba principal B-301',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Juan Pérez',
      location: 'Planta Norte - Sector B',
      dueDate: new Date('2024-01-20T14:00:00'),
      createdDate: new Date('2024-01-15T08:00:00'),
      progress: 65,
      category: 'Mantenimiento',
      estimatedHours: 8,
      actualHours: 5.2
    },
    {
      id: '2',
      title: 'Inspección de Válvulas de Seguridad',
      description: 'Verificar funcionamiento de válvulas de seguridad en sistema principal',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'María García',
      location: 'Planta Sur - Sistema Principal',
      dueDate: new Date('2024-01-22T10:00:00'),
      createdDate: new Date('2024-01-16T09:00:00'),
      progress: 0,
      category: 'Inspección',
      estimatedHours: 4
    },
    {
      id: '3',
      title: 'Calibración de Sensores de Presión',
      description: 'Calibrar sensores de presión en línea de producción',
      priority: 'high',
      status: 'completed',
      assignedTo: 'Carlos López',
      location: 'Planta Central - Línea 2',
      dueDate: new Date('2024-01-18T16:00:00'),
      createdDate: new Date('2024-01-14T07:00:00'),
      progress: 100,
      category: 'Calibración',
      estimatedHours: 6,
      actualHours: 5.8
    },
    {
      id: '4',
      title: 'Limpieza de Filtros de Aire',
      description: 'Limpiar y reemplazar filtros de aire en sistema de ventilación',
      priority: 'low',
      status: 'pending',
      assignedTo: 'Ana Rodríguez',
      location: 'Planta Este - Ventilación',
      dueDate: new Date('2024-01-25T12:00:00'),
      createdDate: new Date('2024-01-17T10:00:00'),
      progress: 0,
      category: 'Limpieza',
      estimatedHours: 3
    },
    {
      id: '5',
      title: 'Reparación de Motor Eléctrico',
      description: 'Reparar motor eléctrico del compresor C-205',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Pedro Martínez',
      location: 'Planta Oeste - Compresor C-205',
      dueDate: new Date('2024-01-19T18:00:00'),
      createdDate: new Date('2024-01-15T11:00:00'),
      progress: 40,
      category: 'Reparación',
      estimatedHours: 12,
      actualHours: 4.8
    }
  ];

  filteredTasks: Task[] = [];
  
  // Estadísticas
  totalTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;
  completedTasks = 0;
  overdueTasks = 0;

  // Filtros
  statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  priorityOptions = [
    { value: '', label: 'Todas las Prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  categoryOptions = [
    { value: '', label: 'Todas las Categorías' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Inspección', label: 'Inspección' },
    { value: 'Calibración', label: 'Calibración' },
    { value: 'Limpieza', label: 'Limpieza' },
    { value: 'Reparación', label: 'Reparación' }
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.filteredTasks = [...this.tasks];
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalTasks = this.tasks.length;
    this.pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
    this.inProgressTasks = this.tasks.filter(t => t.status === 'in-progress').length;
    this.completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    this.overdueTasks = this.tasks.filter(t => 
      t.dueDate < new Date() && t.status !== 'completed'
    ).length;
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.selectedStatus || task.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || task.priority === this.selectedPriority;
      const matchesCategory = !this.selectedCategory || task.category === this.selectedCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'accent';
      case 'in-progress': return 'primary';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'in-progress': return 'play_circle';
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  isOverdue(task: Task): boolean {
    return task.dueDate < new Date() && task.status !== 'completed';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewTaskDetails(task: Task): void {
    this.router.navigate(['/petrotask/activity-management'], { 
      queryParams: { taskId: task.id } 
    });
  }

  editTask(task: Task): void {
    this.router.navigate(['/petrotask/task-planning'], { 
      queryParams: { editTaskId: task.id } 
    });
  }

  assignTask(task: Task): void {
    this.router.navigate(['/petrotask/task-assignment'], { 
      queryParams: { taskId: task.id } 
    });
  }

  getFilteredTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }
}
