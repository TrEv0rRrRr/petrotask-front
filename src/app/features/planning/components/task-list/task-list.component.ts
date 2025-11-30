import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { Task } from '../../model/task.entity';
import { Columns, Sort, SortDirection } from '../../../../shared/components/table/table.models';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatChipsModule,
    TableComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() activityId!: number;
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<Sort>();

  tasks: Task[] = [];
  tableColumns: Columns[] = [];
  
  loading = false;
  sort: Sort = { active: 'title', direction: SortDirection.ASC };

  constructor() {}

  ngOnInit(): void {
    // Mock data for demostration
    this.tasks = [
      new Task(1, 'Inspección inicial', 'Realizar inspección preliminar del sitio', 'COMPLETED', 1),
      new Task(2, 'Preparación de equipos', 'Preparar equipos necesarios para la actividad', 'IN_PROGRESS', 1),
      new Task(3, 'Documentación', 'Completar documentación requerida', 'PENDING', 2)
    ];

    this.initTableColumns();
  }

  initTableColumns(): void {
    this.tableColumns = [
      {
        header: { key: 'title', label: 'Tarea' },
        cell: 'title',
        type: 'text',
        sortable: true,
        hide: { label: 'Tarea', visible: true }
      },
      {
        header: { key: 'description', label: 'Descripción' },
        cell: 'description',
        type: 'text',
        sortable: true,
        hide: { label: 'Descripción', visible: true }
      },
      {
        header: { key: 'status', label: 'Estado' },
        cell: 'status',
        type: 'template',
        sortable: true,
        hide: { label: 'Estado', visible: true }
      },
      {
        header: { key: 'employeeId', label: 'Empleado' },
        cell: 'employeeId',
        type: 'text',
        sortable: true,
        hide: { label: 'Empleado', visible: true }
      },
      {
        header: { key: 'actions', label: 'Acciones' },
        cell: 'actions',
        type: 'template',
        sortable: false,
        hide: { label: 'Acciones', visible: true }
      }
    ];
  }

  getStatusChipClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'status-completed';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return 'check_circle';
      case 'IN_PROGRESS': return 'schedule';
      case 'PENDING': return 'pending';
      case 'CANCELLED': return 'cancel';
      default: return 'help';
    }
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number): void {
    this.deleteTask.emit(taskId);
  }

  onTableRowSelect(task: Task): void {
    this.editTask.emit(task);
  }
} 