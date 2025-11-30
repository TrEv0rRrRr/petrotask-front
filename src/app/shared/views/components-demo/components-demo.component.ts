import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { SelectorComponent } from '../../components/selector/selector.component';
import { Columns } from '../../components/table/table.models';
import { CallbackPipe } from '../../pipes/callback.pipe';
import { ButtonComponent } from '../../components/button/button.component';
import {InputComponent} from '../../components/input/input.component';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {
  TaskExecutionViewComponent
} from '../../../features/planning/components/task-execution-view/task-execution-view.component';
import {
  TaskSchedulingDialogComponent
} from '../../../features/planning/components/task-scheduling-dialog/task-scheduling-dialog.component';
import {SegmentedTaskComponent} from '../../../features/planning/components/segmented-task/segmented-task.component';
import { DateNavigatorComponent } from '../../components/date-navigator/date-navigator.component';

@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [
    TableComponent,
    CallbackPipe,
    SelectorComponent,
    ButtonComponent,
    InputComponent,
    FormsModule,
    TaskExecutionViewComponent,
    TaskSchedulingDialogComponent,
    SegmentedTaskComponent,
    DateNavigatorComponent,
    TranslatePipe
  ],
  templateUrl: './components-demo.component.html',
  styleUrl: './components-demo.component.scss'
})
export class ComponentsDemoComponent {

  namna = (value: any) => {
    return value + 'ñamña';
  }
  options = ['Option 1', 'Option 2', 'Option 3'];
  magia: string = '';

  loadingTest = false;
  tableTestData : any[] = [
    {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      city: 'Anytown',
      state: 'CA',
    },
    {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
    },
    {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
    }
  ]
  columns: Columns[] = [
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
        key: 'age',
        label: 'Age',
      },
      cell: 'age',
      type: 'text',
      sortable: false,
      hide: {
        visible: true,
        label: 'Age',
      }
    },
    {
      header: {
        key: 'email',
        label: 'Actions',
      },
      cell: 'email',
      type: 'edit_option',
      sortable: false,
      hide: {
        visible: true,
        label: 'Email',
      }
    }
  ];
}
