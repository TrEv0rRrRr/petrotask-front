import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../model/task.entity';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-unscheduled-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './unscheduled-task-card.component.html',
  styleUrls: ['./unscheduled-task-card.component.scss']
})
export class UnscheduledTaskCardComponent {
  @Input() task!: Task;
  @Output() schedule = new EventEmitter<Task>();
  @Output() dragStart = new EventEmitter<DragEvent>();

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('type', 'unscheduled-task');
      event.dataTransfer.setData('taskId', this.task.taskId.toString());
      this.dragStart.emit(event);
    }
  }
}
