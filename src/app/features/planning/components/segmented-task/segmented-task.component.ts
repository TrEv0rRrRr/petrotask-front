import {Component, Input} from '@angular/core';
import { Task } from '../../model/task.entity';

@Component({
  selector: 'app-segmented-task',
  imports: [],
  templateUrl: './segmented-task.component.html',
  styleUrl: './segmented-task.component.scss'
})
export class SegmentedTaskComponent {
  @Input() task: Task = new Task(1, 'Default Task', 'Default description', 'PENDING', 1);
}
