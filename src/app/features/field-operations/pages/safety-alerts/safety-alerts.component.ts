import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
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
    TranslateModule,
  ],
  templateUrl: './safety-alerts.component.html',
  styleUrls: ['./safety-alerts.component.scss'],
})
export class SafetyAlertsComponent implements OnInit {
  currentTab = 0;
  safetyAlerts: SafetyAlert[] = [
    {
      id: '1',
      title: 'Fuga de Gas Detectada',
      description:
        'Se detectó una fuga de gas en la válvula V-015 del sector norte',
      type: 'critical',
      priority: 'high',
      location: 'Plataforma Alpha - Sector Norte - Válvula V-015',
      timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutos atrás
      reportedBy: 'Juan Pérez',
      status: 'active',
      assignedTo: 'Carlos Rodríguez',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas desde ahora
      actions: [
        'Evacuación del área inmediata',
        'Cierre de válvula principal',
        'Inspección con detector de gases',
      ],
      photos: [],
    },
    {
      id: '2',
      title: 'Temperatura Elevada en Compresor',
      description:
        'El compresor C-008 alcanzó temperatura de 95°C, superando el límite de 85°C',
      type: 'warning',
      priority: 'high',
      location: 'Planta de Compresión - Área 2',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
      reportedBy: 'María González',
      status: 'acknowledged',
      assignedTo: 'Luis Martínez',
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 horas desde ahora
      actions: [
        'Reducir velocidad de operación',
        'Verificar sistema de refrigeración',
        'Monitoreo continuo de temperatura',
      ],
      photos: [],
    },
    {
      id: '3',
      title: 'Inspección de Válvulas de Seguridad',
      description:
        'Mantenimiento trimestral programado para todas las válvulas PSV',
      type: 'maintenance',
      priority: 'medium',
      location: 'Todas las Plataformas',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      reportedBy: 'Pedro Sánchez',
      status: 'active',
      assignedTo: 'Equipo de Mantenimiento',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas desde ahora
      actions: [
        'Inspección visual de válvulas',
        'Prueba de apertura/cierre',
        'Calibración de presión',
        'Documentación de resultados',
      ],
      photos: [],
    },
    {
      id: '4',
      title: 'Vibración Anormal en Bomba',
      description:
        'La bomba P-003 presenta vibraciones fuera del rango normal (8.5 mm/s)',
      type: 'warning',
      priority: 'medium',
      location: 'Estación de Bombeo Central - Bomba P-003',
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 90 minutos atrás
      reportedBy: 'Ana Torres',
      status: 'acknowledged',
      assignedTo: 'Roberto Silva',
      dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas desde ahora
      actions: [
        'Análisis de vibraciones',
        'Inspección de rodamientos',
        'Verificar alineación',
      ],
      photos: [],
    },
    {
      id: '5',
      title: 'Actualización de Sistema de Control',
      description:
        'Notificación de actualización de firmware disponible para PLC principal',
      type: 'info',
      priority: 'low',
      location: 'Centro de Control - Servidor Principal',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás
      reportedBy: 'Sistema Automático',
      status: 'active',
      assignedTo: 'Jorge Ramírez',
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 horas desde ahora
      actions: [
        'Revisar notas de la versión',
        'Programar ventana de mantenimiento',
        'Realizar backup del sistema',
        'Aplicar actualización',
      ],
      photos: [],
    },
    {
      id: '6',
      title: 'Nivel Bajo de Aceite Lubricante',
      description:
        'El nivel de aceite en el tanque T-012 está por debajo del mínimo requerido',
      type: 'warning',
      priority: 'medium',
      location: 'Campo Beta - Tanque T-012',
      timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 horas atrás
      reportedBy: 'Diego Morales',
      status: 'active',
      assignedTo: 'Fernando López',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 horas desde ahora
      actions: [
        'Rellenar tanque de aceite',
        'Inspeccionar posibles fugas',
        'Verificar consumo anormal',
      ],
      photos: [],
    },
    {
      id: '7',
      title: 'Sensor de Presión con Lectura Errática',
      description:
        'El sensor PT-025 muestra lecturas inconsistentes y requiere calibración',
      type: 'info',
      priority: 'medium',
      location: 'Plataforma Gamma - Línea Principal',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      reportedBy: 'Carmen Vega',
      status: 'acknowledged',
      assignedTo: 'Técnico de Instrumentación',
      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 horas desde ahora
      actions: [
        'Verificar conexiones eléctricas',
        'Calibrar sensor',
        'Reemplazar si es necesario',
      ],
      photos: [],
    },
    {
      id: '8',
      title: 'Prevención de Corrosión - Inspección Programada',
      description:
        'Inspección visual y medición de espesores en tuberías expuestas',
      type: 'maintenance',
      priority: 'medium',
      location: 'Campo Delta - Todas las Líneas',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      reportedBy: 'Departamento de Integridad',
      status: 'resolved',
      assignedTo: 'Equipo de Inspección',
      actions: [
        'Inspección visual completa',
        'Medición ultrasónica de espesores',
        'Aplicación de recubrimiento protector',
        'Documentación fotográfica',
      ],
      photos: [],
    },
    {
      id: '9',
      title: 'Capacitación en Respuesta a Emergencias',
      description:
        'Recordatorio de capacitación mensual obligatoria para todo el personal',
      type: 'info',
      priority: 'low',
      location: 'Sala de Capacitación - Edificio Administrativo',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      reportedBy: 'Recursos Humanos',
      status: 'active',
      actions: [
        'Confirmar asistencia del personal',
        'Preparar material didáctico',
        'Simulacro de evacuación',
      ],
      photos: [],
    },
    {
      id: '10',
      title: 'Derrame Menor de Hidrocarburo',
      description:
        'Se reportó un derrame menor en área de carga, contenido y limpiado',
      type: 'critical',
      priority: 'high',
      location: 'Área de Carga - Muelle 3',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      reportedBy: 'Supervisor de Operaciones',
      status: 'resolved',
      assignedTo: 'Equipo de Respuesta a Derrames',
      actions: [
        'Contención inmediata del derrame',
        'Aplicación de material absorbente',
        'Disposición de residuos peligrosos',
        'Reporte a autoridades ambientales',
      ],
      photos: [],
    },
  ];

  // Tipos de alerta
  alertTypes = [
    { value: 'critical', label: 'Crítica', icon: 'error', color: 'warn' },
    {
      value: 'warning',
      label: 'Advertencia',
      icon: 'warning',
      color: 'accent',
    },
    { value: 'info', label: 'Informativa', icon: 'info', color: 'primary' },
    {
      value: 'maintenance',
      label: 'Mantenimiento',
      icon: 'build',
      color: 'primary',
    },
  ];

  // Prioridades
  priorities = [
    { value: 'high', label: 'Alta', color: 'warn' },
    { value: 'medium', label: 'Media', color: 'accent' },
    { value: 'low', label: 'Baja', color: 'primary' },
  ];

  // Estadísticas
  totalAlerts = 0;
  activeAlerts = 0;
  criticalAlerts = 0;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalAlerts = this.safetyAlerts.length;
    this.activeAlerts = this.safetyAlerts.filter(
      (a) => a.status === 'active'
    ).length;
    this.criticalAlerts = this.safetyAlerts.filter(
      (a) => a.type === 'critical'
    ).length;
  }

  getAlertTypeIcon(type: string): string {
    const alertType = this.alertTypes.find((t) => t.value === type);
    return alertType ? alertType.icon : 'help';
  }

  getAlertTypeColor(type: string): string {
    const alertType = this.alertTypes.find((t) => t.value === type);
    return alertType ? alertType.color : '';
  }

  getPriorityColor(priority: string): string {
    const priorityObj = this.priorities.find((p) => p.value === priority);
    return priorityObj ? priorityObj.color : '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'warn';
      case 'acknowledged':
        return 'accent';
      case 'resolved':
        return 'primary';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active':
        return 'schedule';
      case 'acknowledged':
        return 'check_circle';
      case 'resolved':
        return 'done_all';
      default:
        return 'help';
    }
  }

  acknowledgeAlert(alert: SafetyAlert): void {
    alert.status = 'acknowledged';
    this.calculateStatistics();
  }

  resolveAlert(alert: SafetyAlert): void {
    alert.status = 'resolved';
    this.calculateStatistics();
  }

  createNewAlert(): void {
    const dialogRef = this.dialog.open(CreateAlertDialogComponent, {
      width: '600px',
      data: {
        alertTypes: this.alertTypes,
        priorities: this.priorities,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
      actions: alertData.actions.filter(
        (action: string) => action.trim() !== ''
      ),
      photos: [],
    };

    this.safetyAlerts.unshift(newAlert);
    this.calculateStatistics();

    this.snackBar.open('Alerta de seguridad creada exitosamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getFilteredAlerts(type?: string, status?: string): SafetyAlert[] {
    let filtered = this.safetyAlerts;

    if (type) {
      filtered = filtered.filter((a) => a.type === type);
    }

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    return filtered;
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
