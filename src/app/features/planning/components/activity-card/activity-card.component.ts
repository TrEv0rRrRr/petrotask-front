import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { Activity } from '../../model/activity.entity';
import { Task } from '../../model/task.entity';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    TaskListComponent,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss']
})
export class ActivityCardComponent {
  @Input() activity!: Activity;
  @Input() expanded: boolean = false;
  @Output() toggleExpand = new EventEmitter<number>();
  @Output() editActivity = new EventEmitter<Activity>();
  @Output() deleteActivity = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() addTask = new EventEmitter<number>();

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-in-progress',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'PENDING': 'schedule',
      'IN_PROGRESS': 'directions_car',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel'
    };
    return statusIcons[status] || 'info';
  }

  onToggleExpand(): void {
    this.toggleExpand.emit(this.activity.id);
  }

  onEditActivity(): void {
    this.editActivity.emit(this.activity);
  }

  onDeleteActivity(): void {
    this.deleteActivity.emit(this.activity.id);
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: number): void {
    this.deleteTask.emit(taskId);
  }

  onAddTask(): void {
    this.addTask.emit(this.activity.id);
  }
}
