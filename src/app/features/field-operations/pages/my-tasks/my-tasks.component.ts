import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { IncidentReportDialogComponent } from '../../components/incident-report-dialog/incident-report-dialog.component';
import { TaskExecutionDialogComponent } from '../../components/task-execution-dialog/task-execution-dialog.component';

export interface FieldTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  location: string;
  scheduledDate: Date;
  estimatedDuration: number;
  actualDuration?: number;
  resources: string[];
  tags: string[];
  instructions: string;
  safetyRequirements: string[];
  photos: TaskPhoto[];
  incidents: TaskIncident[];
  startTime?: Date;
  endTime?: Date;
  isOffline: boolean;
  lastSync?: Date;
}

export interface TaskPhoto {
  id: string;
  url: string;
  timestamp: Date;
  description: string;
  category: 'before' | 'during' | 'after' | 'incident';
}

export interface TaskIncident {
  id: string;
  type: 'safety' | 'equipment' | 'environmental' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  photos: string[];
  resolved: boolean;
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent implements OnInit, OnDestroy {
  currentTab = 0;
  isOnline = navigator.onLine;
  myTasks: FieldTask[] = [];

  // Estadísticas del operario
  operatorStats = {
    totalTasks: 0,
    completedToday: 0,
    inProgress: 0,
    pending: 0,
    offlineTasks: 0,
  };

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.updateStats();
    this.setupOfflineDetection();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  private setupOfflineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineTasks();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.snackBar.open(
        'Modo offline activado. Los datos se sincronizarán cuando se recupere la conexión.',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    });
  }

  private updateStats(): void {
    this.operatorStats = {
      totalTasks: this.myTasks.length,
      completedToday: this.myTasks.filter(
        (t) => t.status === 'completed' && t.endTime && this.isToday(t.endTime)
      ).length,
      inProgress: this.myTasks.filter((t) => t.status === 'in-progress').length,
      pending: this.myTasks.filter((t) => t.status === 'pending').length,
      offlineTasks: this.myTasks.filter((t) => t.isOffline).length,
    };
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // US06: Registrar inicio y fin de tareas
  startTask(task: FieldTask): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: '600px',
      data: { task, action: 'start' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        task.status = 'in-progress';
        task.startTime = new Date();
        task.isOffline = !this.isOnline;
        this.updateStats();
        this.snackBar.open('Tarea iniciada correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  completeTask(task: FieldTask): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: '600px',
      data: { task, action: 'complete' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        task.status = 'completed';
        task.endTime = new Date();
        task.actualDuration = this.calculateDuration(
          task.startTime!,
          task.endTime
        );
        task.isOffline = !this.isOnline;
        this.updateStats();
        this.snackBar.open('Tarea completada correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  // US07: Adjuntar fotografías
  addPhoto(task: FieldTask): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: '600px',
      data: { task, action: 'photo' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.photo) {
        const newPhoto: TaskPhoto = {
          id: this.generateId(),
          url: result.photo.url,
          timestamp: new Date(),
          description: result.photo.description,
          category: result.photo.category,
        };
        task.photos.push(newPhoto);
        task.isOffline = !this.isOnline;
        this.snackBar.open('Foto agregada correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  // US08: Reportar incidencias
  reportIncident(task: FieldTask): void {
    const dialogRef = this.dialog.open(IncidentReportDialogComponent, {
      width: '600px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newIncident: TaskIncident = {
          id: this.generateId(),
          type: result.type,
          severity: result.severity,
          description: result.description,
          timestamp: new Date(),
          photos: result.photos || [],
          resolved: false,
        };
        task.incidents.push(newIncident);
        task.isOffline = !this.isOnline;
        this.snackBar.open('Incidencia reportada correctamente', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  private syncOfflineTasks(): void {
    const offlineTasks = this.myTasks.filter((t) => t.isOffline);
    if (offlineTasks.length > 0) {
      // Simular sincronización
      setTimeout(() => {
        offlineTasks.forEach((task) => {
          task.isOffline = false;
          task.lastSync = new Date();
        });
        this.snackBar.open(
          `${offlineTasks.length} tareas sincronizadas correctamente`,
          'Cerrar',
          { duration: 3000 }
        );
      }, 2000);
    }
  }

  private calculateDuration(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // en horas
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'warn';
      case 'high':
        return 'accent';
      case 'medium':
        return 'primary';
      case 'low':
        return '';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '';
      case 'in-progress':
        return 'accent';
      case 'completed':
        return 'primary';
      case 'blocked':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'in-progress':
        return 'play_circle';
      case 'completed':
        return 'check_circle';
      case 'blocked':
        return 'block';
      default:
        return 'help';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'check_circle';
      default:
        return 'help';
    }
  }

  formatDuration(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  getProgressPercentage(task: FieldTask): number {
    if (task.status === 'completed') return 100;
    if (task.status === 'pending') return 0;
    if (task.actualDuration && task.estimatedDuration) {
      return Math.min(
        (task.actualDuration / task.estimatedDuration) * 100,
        100
      );
    }
    return 0;
  }

  getActiveTasks(): FieldTask[] {
    return this.myTasks.filter((t) => t.status !== 'completed');
  }

  getCompletedTasks(): FieldTask[] {
    return this.myTasks.filter((t) => t.status === 'completed');
  }
}
