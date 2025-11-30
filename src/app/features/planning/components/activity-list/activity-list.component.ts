import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { Activity } from '../../model/activity.entity';
import { Task } from '../../model/task.entity';
import { ActivityCardComponent } from '../activity-card/activity-card.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    ActivityCardComponent,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
  @Input() activities: Activity[] = [];
  @Output() editActivity = new EventEmitter<Activity>();
  @Output() deleteActivity = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() addTask = new EventEmitter<number>();

  expandedActivityId: number | null = null;

  toggleExpand(activityId: number): void {
    this.expandedActivityId = this.expandedActivityId === activityId ? null : activityId;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente': return 'status-pending';
      case 'En progreso': return 'status-in-progress';
      case 'Finalizada': return 'status-completed';
      case 'Cancelada': return 'status-cancelled';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Alta': return 'priority-high';
      case 'Media': return 'priority-medium';
      case 'Baja': return 'priority-low';
      default: return '';
    }
  }

  onEditActivity(activity: Activity): void {
    this.editActivity.emit(activity);
  }

  onDeleteActivity(activityId: number): void {
    this.deleteActivity.emit(activityId);
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number): void {
    this.deleteTask.emit(taskId);
  }

  onAddTask(activityId: number): void {
    this.addTask.emit(activityId);
  }
}
