import { Component } from '@angular/core';
import {Employee} from '../../../resources/models/employee.entity';
import {TableComponent} from "../../../../shared/components/table/table.component";
import {Columns} from '../../../../shared/components/table/table.models';
import {Task} from '../../model/task.entity';
import {MatProgressBar} from '@angular/material/progress-bar';
import {NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {TaskExecutionViewComponent} from '../task-execution-view/task-execution-view.component';

@Component({
  selector: 'app-task-list-operario-view',
  imports: [
    TableComponent,
    MatProgressBar,
    NgIf,
    MatIconButton,
  ],
  templateUrl: './task-list-operario-view.component.html',
  styleUrl: './task-list-operario-view.component.scss'
})
export class TaskListOperarioViewComponent {

  constructor(private dialog: MatDialog) {}

  operario: Employee = new Employee();

  tasks: Task[] = [ new Task(), new Task(), new Task()];

  columns: Columns[] = [
    {
      header: {
        key: 'activity',
        label: 'Activity',
      },
      cell: 'activity',
      type: 'text',
      sortable: false,
      hide: {
        visible: true,
        label: 'Activity',
      }
    },
    {
      header: {
        key: 'taskId',
        label: 'Task ID',
      },
      cell: 'taskId',
      type: 'text',
      sortable: false,
      hide: {
        visible: true,
        label: 'Task ID',
      }
    },
    {
      header: {
        key: 'name',
        label: 'Name',
      },
      cell: 'name',
      type: 'text',
      sortable: false,
      hide: {
        visible: true,
        label: 'Name',
      }
    },
    {
      header: {
        key: 'schedule',
        label: 'Schedule',
      },
      cell: 'schedule',
      type: 'text',
      sortable: false,
      hide: {
        visible: false,
        label: 'Schedule',
      }
    },
    {
      header: {
        key: 'equipment',
        label: 'Equipment',
      },
      cell: 'equipment',
      type: 'text',
      sortable: false,
      hide: {
        visible: true,
        label: 'Equipment',
      }
    },
    {
      header: {
        key: 'action',
        label: 'Ejecutar',
      },
      cell: 'action',
      type: 'template',
      sortable: false,
      hide: {
        visible: true,
        label: 'Ejecutar',
      }
    }
  ];

  loadingTest = false;
  tableData : any[] = this.tasks.map(tasks => ({
    activity: tasks.activityId,
    name: tasks.title,
    taskId: tasks.taskId,
    schedule: tasks.status,
    equipment: tasks.employeeId
  }));

  onEjectTask(row: any) {
    const dialogRef = this.dialog.open(TaskExecutionViewComponent, {
      width: '500px', // Puedes ajustar el tamaño
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      // Aquí puedes manejar lo que ocurre después de cerrar el diálogo, si es necesario
    });
  }
}
