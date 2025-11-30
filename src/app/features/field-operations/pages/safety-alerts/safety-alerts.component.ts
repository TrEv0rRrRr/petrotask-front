import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { CreateAlertDialogComponent } from './create-alert-dialog.component';

interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  location: string;
  timestamp: Date;
  reportedBy: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  dueDate?: Date;
  actions: string[];
  photos?: string[];
}

@Component({
  selector: 'app-safety-alerts',
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
    TranslateModule
  ],
  templateUrl: './safety-alerts.component.html',
  styleUrls: ['./safety-alerts.component.scss']
})
export class SafetyAlertsComponent implements OnInit {
  currentTab = 0;
  
  // Alertas de seguridad
  safetyAlerts: SafetyAlert[] = [
    {
      id: '1',
      title: 'Presión Alta en Sistema Principal',
      description: 'La presión del sistema principal ha excedido los límites seguros. Se requiere intervención inmediata.',
      type: 'critical',
      priority: 'high',
      location: 'Planta Norte - Sistema Principal',
      timestamp: new Date('2024-01-15T10:30:00'),
      reportedBy: 'Sistema Automático',
      status: 'active',
      assignedTo: 'Equipo de Emergencia',
      dueDate: new Date('2024-01-15T11:00:00'),
      actions: [
        'Reducir presión del sistema',
        'Verificar válvulas de seguridad',
        'Notificar al supervisor',
        'Documentar el incidente'
      ]
    },
    {
      id: '2',
      title: 'Equipo de Protección Personal Faltante',
      description: 'Se detectó personal trabajando sin el EPP requerido en el área de mantenimiento.',
      type: 'warning',
      priority: 'medium',
      location: 'Planta Sur - Área de Mantenimiento',
      timestamp: new Date('2024-01-15T09:15:00'),
      reportedBy: 'Juan Pérez',
      status: 'acknowledged',
      assignedTo: 'Supervisor de Seguridad',
      dueDate: new Date('2024-01-15T12:00:00'),
      actions: [
        'Verificar uso de EPP',
        'Capacitar al personal',
        'Revisar procedimientos'
      ]
    },
    {
      id: '3',
      title: 'Mantenimiento Programado',
      description: 'Recordatorio: Mantenimiento preventivo programado para bomba B-301.',
      type: 'maintenance',
      priority: 'low',
      location: 'Planta Central - Bomba B-301',
      timestamp: new Date('2024-01-15T08:00:00'),
      reportedBy: 'Sistema de Planificación',
      status: 'active',
      assignedTo: 'Equipo de Mantenimiento',
      dueDate: new Date('2024-01-16T08:00:00'),
      actions: [
        'Preparar herramientas',
        'Coordinar con operaciones',
        'Ejecutar mantenimiento'
      ]
    },
    {
      id: '4',
      title: 'Temperatura Elevada en Compresor',
      description: 'La temperatura del compresor C-205 está por encima del rango normal.',
      type: 'warning',
      priority: 'medium',
      location: 'Planta Este - Compresor C-205',
      timestamp: new Date('2024-01-15T07:45:00'),
      reportedBy: 'María García',
      status: 'resolved',
      assignedTo: 'Técnico Especializado',
      actions: [
        'Verificar sistema de enfriamiento',
        'Revisar filtros de aire',
        'Monitorear temperatura'
      ]
    }
  ];

  // Tipos de alerta
  alertTypes = [
    { value: 'critical', label: 'Crítica', icon: 'error', color: 'warn' },
    { value: 'warning', label: 'Advertencia', icon: 'warning', color: 'accent' },
    { value: 'info', label: 'Informativa', icon: 'info', color: 'primary' },
    { value: 'maintenance', label: 'Mantenimiento', icon: 'build', color: 'primary' }
  ];

  // Prioridades
  priorities = [
    { value: 'high', label: 'Alta', color: 'warn' },
    { value: 'medium', label: 'Media', color: 'accent' },
    { value: 'low', label: 'Baja', color: 'primary' }
  ];

  // Estadísticas
  totalAlerts = 0;
  activeAlerts = 0;
  criticalAlerts = 0;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalAlerts = this.safetyAlerts.length;
    this.activeAlerts = this.safetyAlerts.filter(a => a.status === 'active').length;
    this.criticalAlerts = this.safetyAlerts.filter(a => a.type === 'critical').length;
  }

  getAlertTypeIcon(type: string): string {
    const alertType = this.alertTypes.find(t => t.value === type);
    return alertType ? alertType.icon : 'help';
  }

  getAlertTypeColor(type: string): string {
    const alertType = this.alertTypes.find(t => t.value === type);
    return alertType ? alertType.color : '';
  }

  getPriorityColor(priority: string): string {
    const priorityObj = this.priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'warn';
      case 'acknowledged': return 'accent';
      case 'resolved': return 'primary';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'schedule';
      case 'acknowledged': return 'check_circle';
      case 'resolved': return 'done_all';
      default: return 'help';
    }
  }

  acknowledgeAlert(alert: SafetyAlert): void {
    alert.status = 'acknowledged';
    this.calculateStatistics();
    console.log('Alerta reconocida:', alert.title);
  }

  resolveAlert(alert: SafetyAlert): void {
    alert.status = 'resolved';
    this.calculateStatistics();
    console.log('Alerta resuelta:', alert.title);
  }

  createNewAlert(): void {
    const dialogRef = this.dialog.open(CreateAlertDialogComponent, {
      width: '600px',
      data: {
        alertTypes: this.alertTypes,
        priorities: this.priorities
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNewAlert(result);
      }
    });
  }

  addNewAlert(alertData: any): void {
    const newAlert: SafetyAlert = {
      id: Date.now().toString(),
      title: alertData.title,
      description: alertData.description,
      type: alertData.type,
      priority: alertData.priority,
      location: alertData.location,
      timestamp: new Date(),
      reportedBy: 'Usuario Actual', // En producción sería el usuario logueado
      status: 'active',
      assignedTo: alertData.assignedTo || undefined,
      dueDate: alertData.dueDate || undefined,
      actions: alertData.actions.filter((action: string) => action.trim() !== ''),
      photos: []
    };

    this.safetyAlerts.unshift(newAlert);
    this.calculateStatistics();

    this.snackBar.open('Alerta de seguridad creada exitosamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    console.log('Nueva alerta creada:', newAlert);
  }

  getFilteredAlerts(type?: string, status?: string): SafetyAlert[] {
    let filtered = this.safetyAlerts;
    
    if (type) {
      filtered = filtered.filter(a => a.type === type);
    }
    
    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }
    
    return filtered;
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

  isOverdue(alert: SafetyAlert): boolean {
    if (!alert.dueDate) return false;
    return new Date() > alert.dueDate && alert.status !== 'resolved';
  }

  getTimeRemaining(alert: SafetyAlert): string {
    if (!alert.dueDate) return '';
    
    const now = new Date();
    const diff = alert.dueDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Vencido';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}
