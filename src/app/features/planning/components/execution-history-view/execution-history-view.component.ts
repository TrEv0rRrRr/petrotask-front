import { Component } from '@angular/core';
import { DateNavigatorComponent } from 'src/app/shared/components/date-navigator/date-navigator.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Columns } from 'src/app/shared/components/table/table.models';
import { TranslatePipe } from '@ngx-translate/core';

interface TaskExecution {
  task: string;
  plannedDate: Date;
  realDate: Date;
  status: string;
  comment: string;
}

@Component({
  selector: 'app-execution-history-view',
  templateUrl: './execution-history-view.component.html',
  styleUrl: './execution-history-view.component.scss',
  standalone: true,
  imports: [CommonModule, DateNavigatorComponent, ButtonComponent, TableComponent, TranslatePipe]
})
export class ExecutionHistoryViewComponent {
  selectedDate: Date = new Date();
  chart: Chart | null = null;

  allExecutions: TaskExecution[] = [
    {
      task: 'Carga de camión',
      plannedDate: new Date('2024-06-01'),
      realDate: new Date('2024-06-01'),
      status: 'execution-history.status.completed',
      comment: 'Sin incidencias.'
    },
    {
      task: 'Salida a ruta',
      plannedDate: new Date('2024-06-02'),
      realDate: new Date('2024-06-03'),
      status: 'execution-history.status.delayed',
      comment: 'Retraso por tráfico.'
    },
    {
      task: 'Entrega parcial',
      plannedDate: new Date('2024-06-03'),
      realDate: new Date('2024-06-03'),
      status: 'execution-history.status.completed',
      comment: 'Entrega exitosa.'
    },
    {
      task: 'Descarga',
      plannedDate: new Date('2024-06-04'),
      realDate: new Date('2024-06-04'),
      status: 'execution-history.status.in-progress',
      comment: 'En proceso.'
    },
    {
      task: 'Retorno',
      plannedDate: new Date('2024-06-05'),
      realDate: new Date('2024-06-06'),
      status: 'execution-history.status.delayed',
      comment: 'Demora por mantenimiento.'
    }
  ];

  get executions() {
    // Filtrar por la semana del selectedDate
    const start = new Date(this.selectedDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return this.allExecutions.filter(e => e.plannedDate >= start && e.plannedDate <= end);
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    setTimeout(() => this.updateChart(), 0);
  }

  updateChart() {
    // Implementación en el template
  }

  exportToPDF() {
    // Lógica de exportación
    alert('Exportar a PDF (demo)');
  }
  exportToCSV() {
    // Lógica de exportación
    alert('Exportar a CSV (demo)');
  }

  columns: Columns[] = [
    {
      header: { key: 'task', label: 'execution-history.table.task' },
      cell: 'task',
      type: 'text',
      sortable: true
    },
    {
      header: { key: 'plannedDate', label: 'execution-history.table.planned-date' },
      cell: 'plannedDate',
      type: 'date',
      sortable: true
    },
    {
      header: { key: 'realDate', label: 'execution-history.table.real-date' },
      cell: 'realDate',
      type: 'date',
      sortable: true
    },
    {
      header: { key: 'status', label: 'execution-history.table.status' },
      cell: 'status',
      type: 'template',
      sortable: true
    },
    {
      header: { key: 'comment', label: 'execution-history.table.comment' },
      cell: 'comment',
      type: 'text',
      sortable: false
    }
  ];
}
