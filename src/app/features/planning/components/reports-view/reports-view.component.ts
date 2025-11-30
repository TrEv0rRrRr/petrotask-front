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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    TranslateModule
  ],
  templateUrl: './reports-view.component.html',
  styleUrl: './reports-view.component.scss'
})
export class ReportsViewComponent implements OnInit {
  currentTab = 0;
  selectedPeriod = 'month';
  selectedTeam = '';
  selectedResource = '';

  // Datos de ejemplo
  teamPerformance: TeamPerformance[] = [
    {
      teamName: 'Equipo Mantenimiento A',
      completedTasks: 45,
      totalTasks: 50,
      efficiency: 90,
      avgCompletionTime: 4.2,
      productivity: 95
    },
    {
      teamName: 'Equipo Inspección B',
      completedTasks: 38,
      totalTasks: 42,
      efficiency: 90.5,
      avgCompletionTime: 3.8,
      productivity: 92
    },
    {
      teamName: 'Equipo Calibración C',
      completedTasks: 52,
      totalTasks: 55,
      efficiency: 94.5,
      avgCompletionTime: 2.9,
      productivity: 98
    },
    {
      teamName: 'Equipo Emergencias D',
      completedTasks: 28,
      totalTasks: 35,
      efficiency: 80,
      avgCompletionTime: 6.1,
      productivity: 85
    }
  ];

  resourceUsage: ResourceUsage[] = [
    {
      resourceName: 'Bomba Principal B-301',
      resourceType: 'Equipo Crítico',
      totalHours: 168,
      utilization: 85,
      cost: 2500,
      status: 'active'
    },
    {
      resourceName: 'Compresor C-205',
      resourceType: 'Equipo Crítico',
      totalHours: 156,
      utilization: 78,
      cost: 2200,
      status: 'active'
    },
    {
      resourceName: 'Sistema de Válvulas V-100',
      resourceType: 'Sistema de Seguridad',
      totalHours: 120,
      utilization: 60,
      cost: 1800,
      status: 'maintenance'
    },
    {
      resourceName: 'Motor Eléctrico M-450',
      resourceType: 'Equipo Auxiliar',
      totalHours: 96,
      utilization: 48,
      cost: 1200,
      status: 'idle'
    },
    {
      resourceName: 'Sistema de Monitoreo SM-200',
      resourceType: 'Sistema de Control',
      totalHours: 168,
      utilization: 95,
      cost: 3200,
      status: 'active'
    }
  ];

  incidents: IncidentReport[] = [
    {
      id: 'INC-001',
      title: 'Presión Alta en Sistema Principal',
      description: 'La presión del sistema principal ha excedido los límites seguros',
      severity: 'critical',
      status: 'resolved',
      location: 'Planta Norte - Sistema Principal',
      reportedBy: 'Juan Pérez',
      reportedDate: new Date('2024-01-15T10:30:00'),
      resolvedDate: new Date('2024-01-15T14:45:00'),
      category: 'Seguridad'
    },
    {
      id: 'INC-002',
      title: 'Falla en Sensor de Temperatura',
      description: 'Sensor de temperatura T-205 reportando lecturas incorrectas',
      severity: 'high',
      status: 'investigating',
      location: 'Planta Sur - Línea 2',
      reportedBy: 'María García',
      reportedDate: new Date('2024-01-16T08:15:00'),
      category: 'Equipos'
    },
    {
      id: 'INC-003',
      title: 'Vibración Anormal en Compresor',
      description: 'Vibración excesiva detectada en compresor C-205',
      severity: 'medium',
      status: 'open',
      location: 'Planta Central - Compresor C-205',
      reportedBy: 'Carlos López',
      reportedDate: new Date('2024-01-17T16:20:00'),
      category: 'Mantenimiento'
    },
    {
      id: 'INC-004',
      title: 'Fuga Menor en Válvula',
      description: 'Fuga menor detectada en válvula V-150',
      severity: 'low',
      status: 'resolved',
      location: 'Planta Este - Válvula V-150',
      reportedBy: 'Ana Rodríguez',
      reportedDate: new Date('2024-01-18T11:30:00'),
      resolvedDate: new Date('2024-01-18T13:15:00'),
      category: 'Equipos'
    }
  ];

  productivityMetrics: ProductivityMetric[] = [
    {
      metric: 'Tareas Completadas',
      current: 163,
      previous: 148,
      trend: 10.1,
      unit: 'tareas'
    },
    {
      metric: 'Eficiencia Promedio',
      current: 88.8,
      previous: 85.2,
      trend: 4.2,
      unit: '%'
    },
    {
      metric: 'Tiempo Promedio de Completado',
      current: 4.2,
      previous: 4.8,
      trend: -12.5,
      unit: 'horas'
    },
    {
      metric: 'Utilización de Recursos',
      current: 73.2,
      previous: 68.9,
      trend: 6.2,
      unit: '%'
    }
  ];

  // Filtros
  periodOptions = [
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mes' },
    { value: 'quarter', label: 'Último Trimestre' },
    { value: 'year', label: 'Último Año' }
  ];

  teamOptions = [
    { value: '', label: 'Todos los Equipos' },
    { value: 'Equipo Mantenimiento A', label: 'Equipo Mantenimiento A' },
    { value: 'Equipo Inspección B', label: 'Equipo Inspección B' },
    { value: 'Equipo Calibración C', label: 'Equipo Calibración C' },
    { value: 'Equipo Emergencias D', label: 'Equipo Emergencias D' }
  ];

  resourceOptions = [
    { value: '', label: 'Todos los Recursos' },
    { value: 'Equipo Crítico', label: 'Equipo Crítico' },
    { value: 'Sistema de Seguridad', label: 'Sistema de Seguridad' },
    { value: 'Equipo Auxiliar', label: 'Equipo Auxiliar' },
    { value: 'Sistema de Control', label: 'Sistema de Control' }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Inicializar datos
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'warn';
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'resolved': return 'primary';
      case 'investigating': return 'accent';
      case 'open': return 'warn';
      default: return '';
    }
  }

  getResourceStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'maintenance': return 'accent';
      case 'idle': return 'warn';
      default: return '';
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
      minute: '2-digit'
    });
  }

  downloadReport(reportType: string): void {
    this.snackBar.open(`Descargando reporte de ${reportType}...`, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    console.log(`Descargando reporte: ${reportType}`);
  }


  getFilteredTeams(): TeamPerformance[] {
    if (!this.selectedTeam) return this.teamPerformance;
    return this.teamPerformance.filter(team => team.teamName === this.selectedTeam);
  }

  getFilteredResources(): ResourceUsage[] {
    if (!this.selectedResource) return this.resourceUsage;
    return this.resourceUsage.filter(resource => resource.resourceType === this.selectedResource);
  }
}
