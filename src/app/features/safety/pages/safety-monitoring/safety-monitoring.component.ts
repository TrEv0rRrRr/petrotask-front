import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

interface SafetyAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  priority: number;
}

interface SafetyMetric {
  name: string;
  value: number;
  unit: string;
  status: 'safe' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-safety-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule,
    TranslateModule,
  ],
  templateUrl: './safety-monitoring.component.html',
  styleUrls: ['./safety-monitoring.component.scss'],
})
export class SafetyMonitoringComponent implements OnInit {
  currentTab = 0;

  // Métricas de seguridad en tiempo real
  safetyMetrics: SafetyMetric[] = [
    {
      name: 'Presión del Sistema',
      value: 45.2,
      unit: 'PSI',
      status: 'safe',
      trend: 'stable',
    },
    {
      name: 'Temperatura de Proceso',
      value: 85.7,
      unit: '°C',
      status: 'warning',
      trend: 'up',
    },
    {
      name: 'Nivel de Combustible',
      value: 78.3,
      unit: '%',
      status: 'safe',
      trend: 'down',
    },
    {
      name: 'Integridad Estructural',
      value: 92.1,
      unit: '%',
      status: 'safe',
      trend: 'stable',
    },
  ];

  // Alertas de seguridad activas
  activeAlerts: SafetyAlert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Alta Presión en Válvula Principal',
      description:
        'La presión ha excedido el límite seguro en la válvula V-001',
      location: 'Plataforma Alpha - Sector Norte',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      status: 'active',
      priority: 1,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Temperatura Elevada en Compresor',
      description:
        'El compresor C-002 muestra temperatura por encima del rango normal',
      location: 'Planta de Procesamiento - Área 3',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
      status: 'acknowledged',
      priority: 2,
    },
    {
      id: '3',
      type: 'info',
      title: 'Mantenimiento Programado',
      description:
        'Inspección rutinaria de válvulas de seguridad programada para mañana',
      location: 'Todas las ubicaciones',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      status: 'active',
      priority: 3,
    },
  ];

  // Historial de incidentes
  incidentHistory: SafetyAlert[] = [
    {
      id: '4',
      type: 'critical',
      title: 'Fuga Menor Detectada',
      description: 'Se detectó una fuga menor en la línea de transferencia',
      location: 'Campo Beta - Pozo 15',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      status: 'resolved',
      priority: 1,
    },
    {
      id: '5',
      type: 'warning',
      title: 'Vibración Anormal en Bomba',
      description: 'La bomba B-003 presenta vibraciones fuera del rango normal',
      location: 'Estación de Bombeo Central',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
      status: 'resolved',
      priority: 2,
    },
  ];

  // Columnas para la tabla de alertas
  alertColumns: string[] = [
    'type',
    'title',
    'location',
    'timestamp',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    // Simular actualizaciones en tiempo real
    this.startRealTimeUpdates();
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      // Simular cambios en las métricas
      this.safetyMetrics.forEach((metric) => {
        const variation = (Math.random() - 0.5) * 2; // ±1
        metric.value = Number(
          Math.max(0, Math.min(100, metric.value + variation)).toFixed(2)
        );

        // Actualizar estado basado en el valor
        if (metric.value > 90) {
          metric.status = 'critical';
        } else if (metric.value > 75) {
          metric.status = 'warning';
        } else {
          metric.status = 'safe';
        }
      });
    }, 5000); // Actualizar cada 5 segundos
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'help';
    }
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'critical':
        return 'warn';
      case 'warning':
        return 'accent';
      case 'info':
        return 'primary';
      default:
        return '';
    }
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

  acknowledgeAlert(alert: SafetyAlert): void {
    alert.status = 'acknowledged';
    console.log('Alerta reconocida:', alert.id);
  }

  resolveAlert(alert: SafetyAlert): void {
    alert.status = 'resolved';
    console.log('Alerta resuelta:', alert.id);
  }

  getMetricStatusIcon(status: string): string {
    switch (status) {
      case 'safe':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'help';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      case 'stable':
        return 'trending_flat';
      default:
        return 'help';
    }
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `Hace ${minutes} min`;
    } else if (hours < 24) {
      return `Hace ${hours}h`;
    } else {
      return `Hace ${days}d`;
    }
  }

  getMetricProgress(metric: SafetyMetric): number {
    switch (metric.status) {
      case 'safe':
        return 100;
      case 'warning':
        return 70;
      case 'critical':
        return 30;
      default:
        return 50;
    }
  }

  getMetricColor(status: string): string {
    switch (status) {
      case 'safe':
        return 'primary';
      case 'warning':
        return 'accent';
      case 'critical':
        return 'warn';
      default:
        return '';
    }
  }

  getCriticalAlertsCount(): number {
    return this.activeAlerts.filter((alert) => alert.type === 'critical')
      .length;
  }

  getWarningAlertsCount(): number {
    return this.activeAlerts.filter((alert) => alert.type === 'warning').length;
  }

  getInfoAlertsCount(): number {
    return this.activeAlerts.filter((alert) => alert.type === 'info').length;
  }

  displayedColumns: string[] = [
    'type',
    'title',
    'location',
    'timestamp',
    'status',
  ];
}
