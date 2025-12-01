import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

interface TeamPerformance {
  teamName: string;
  completedTasks: number;
  totalTasks: number;
  efficiency: number;
  avgCompletionTime: number;
  productivity: number;
}

interface ResourceUsage {
  resourceName: string;
  resourceType: string;
  totalHours: number;
  utilization: number;
  cost: number;
  status: 'active' | 'maintenance' | 'idle';
}

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  location: string;
  reportedBy: string;
  reportedDate: Date;
  resolvedDate?: Date;
  category: string;
}

interface ProductivityMetric {
  metric: string;
  current: number;
  previous: number;
  trend: number;
  unit: string;
}

@Component({
  selector: 'app-reports-view',
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
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
  ],
  templateUrl: './reports-view.component.html',
  styleUrl: './reports-view.component.scss',
})
export class ReportsViewComponent implements OnInit {
  currentTab = 0;
  selectedPeriod = 'month';
  selectedTeam = '';
  selectedResource = '';

  teamPerformance: TeamPerformance[] = [];
  resourceUsage: ResourceUsage[] = [];
  incidents: IncidentReport[] = [];
  productivityMetrics: ProductivityMetric[] = [];

  // Filtros
  periodOptions = [
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Año' },
  ];

  teamOptions = [
    { value: '', label: 'Todos los Equipos' },
    { value: 'Equipo Mantenimiento A', label: 'Equipo Mantenimiento A' },
    { value: 'Equipo Inspección B', label: 'Equipo Inspección B' },
    { value: 'Equipo Calibración C', label: 'Equipo Calibración C' },
    { value: 'Equipo Emergencias D', label: 'Equipo Emergencias D' },
  ];

  resourceOptions = [
    { value: '', label: 'Todos los Recursos' },
    { value: 'Equipo Crítico', label: 'Equipo Crítico' },
    { value: 'Sistema de Seguridad', label: 'Sistema de Seguridad' },
    { value: 'Equipo Auxiliar', label: 'Equipo Auxiliar' },
    { value: 'Sistema de Control', label: 'Sistema de Control' },
  ];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Inicializar datos
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'warn';
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      case 'low':
        return 'primary';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'resolved':
        return 'primary';
      case 'investigating':
        return 'accent';
      case 'open':
        return 'warn';
      default:
        return '';
    }
  }

  getResourceStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'maintenance':
        return 'accent';
      case 'idle':
        return 'warn';
      default:
        return '';
    }
  }

  getTrendIcon(trend: number): string {
    return trend >= 0 ? 'trending_up' : 'trending_down';
  }

  getTrendColor(trend: number): string {
    return trend >= 0 ? 'primary' : 'warn';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  downloadReport(reportType: string): void {
    this.snackBar.open(`Descargando reporte de ${reportType}...`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getFilteredTeams(): TeamPerformance[] {
    if (!this.selectedTeam) return this.teamPerformance;
    return this.teamPerformance.filter(
      (team) => team.teamName === this.selectedTeam
    );
  }

  getFilteredResources(): ResourceUsage[] {
    if (!this.selectedResource) return this.resourceUsage;
    return this.resourceUsage.filter(
      (resource) => resource.resourceType === this.selectedResource
    );
  }
}
