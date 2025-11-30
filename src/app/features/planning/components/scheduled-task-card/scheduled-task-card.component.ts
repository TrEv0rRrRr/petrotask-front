import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskProgramming } from '../../model/task-programming.entity';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-scheduled-task-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './scheduled-task-card.component.html',
  styleUrls: ['./scheduled-task-card.component.scss']
})
export class ScheduledTaskCardComponent {
  @Input() schedule!: TaskProgramming;
  @Output() editScheduling = new EventEmitter<TaskProgramming>();
  @Output() dragStart = new EventEmitter<DragEvent>();

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('type', 'scheduled-task');
      event.dataTransfer.setData('schedulingId', this.schedule.taskProgrammingId.toString());
      event.dataTransfer.setData('taskId', this.schedule.taskId?.toString() || '');
      event.dataTransfer.setData('startHour', this.schedule.start?.getHours().toString() || '0');
      this.dragStart.emit(event);
    }
  }

  onEditScheduling(): void {
    this.editScheduling.emit(this.schedule);
  }
}
