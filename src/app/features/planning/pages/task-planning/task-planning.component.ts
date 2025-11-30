import { Component, OnInit, TemplateRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { addHours, addDays, subDays } from 'date-fns';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { DateNavigatorComponent } from '../../../../shared/components/date-navigator/date-navigator.component';
import { TaskProgramming } from '../../model/task-programming.entity';
import { Task } from '../../model/task.entity';
import { TaskSchedulingDialogComponent } from '../../components/task-scheduling-dialog/task-scheduling-dialog.component';
import { UnscheduledTaskCardComponent } from '../../components/unscheduled-task-card/unscheduled-task-card.component';
import { ScheduledTaskCardComponent } from '../../components/scheduled-task-card/scheduled-task-card.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { Columns, Sort, SortDirection } from '../../../../shared/components/table/table.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../../../shared/services/dialog.service';
import { TaskService } from '../../services/task.service';
import { TaskProgrammingService } from '../../services/task-programming.service';

interface CalendarEvent {
  id?: string | number;
  title: string;
  start: Date;
  end?: Date;
  meta?: any;
}

interface CalendarEventTimesChangedEvent {
  event: CalendarEvent;
  newStart: Date;
  newEnd?: Date;
}

interface StorageState {
  taskProgrammings: TaskProgramming[];
  unscheduledTasks: Task[];
  viewMode: 'calendar' | 'table';
  searchTerm: string;
  scheduledTasksSort: Sort;
  unscheduledTasksSort: Sort;
  selectedDate: string;
  statusFilter: string;
  startDate: string | null;
  endDate: string | null;
  showCompleted: boolean;
  groupBy: 'none' | 'status';
}

@Component({
  selector: 'app-task-planning',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    DragDropModule,
    DateNavigatorComponent,
    UnscheduledTaskCardComponent,
    ScheduledTaskCardComponent,
    TableComponent,
    TranslateModule,
    TranslatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './task-planning.component.html',
  styleUrl: './task-planning.component.scss'
})
export class TaskPlanningComponent implements OnInit {
  @ViewChild('scheduledActionsTemplate') scheduledActionsTemplate!: TemplateRef<any>;
  @ViewChild('unscheduledActionsTemplate') unscheduledActionsTemplate!: TemplateRef<any>;
  @ViewChild('customEventTitle') customEventTitleTemplate!: TemplateRef<any>;

  selectedDate: Date = new Date();
  viewDate: Date = new Date();
  viewMode: 'calendar' | 'table' = 'calendar';

  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();

  taskProgrammings: TaskProgramming[] = [];
  unscheduledTasks: Task[] = [];
  filteredUnscheduledTasks: Task[] = [];
  searchTerm: string = '';

  draggingTask: boolean = false;

  timeSlots: string[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return `${hour}:00`;
  });

  scheduledTasksColumns: Columns[] = [];
  unscheduledTasksColumns: Columns[] = [];
  scheduledTasksSort: Sort = { active: 'start', direction: SortDirection.ASC };
  unscheduledTasksSort: Sort = { active: 'title', direction: SortDirection.ASC };

  // Filter properties
  statusFilter: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // View settings
  showCompleted: boolean = true;
  groupBy: 'none' | 'status' = 'none';

  private localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'task_planning_state';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private taskService: TaskService,
    private taskProgrammingService: TaskProgrammingService
  ) {
    this.initTableColumns();
  }

  ngOnInit(): void {
    this.loadState();
    this.loadTasksForDate(this.selectedDate);
  }

  initTableColumns(): void {
    this.scheduledTasksColumns = [
      {
        header: { key: 'taskId', label: 'Task ID' },
        cell: 'taskId',
        type: 'text',
        sortable: true,
        hide: { label: 'Task ID', visible: true }
      },
      {
        header: { key: 'start', label: 'Start Time' },
        cell: 'start',
        type: 'date',
        sortable: true,
        hide: { label: 'Start Time', visible: true }
      },
      {
        header: { key: 'end', label: 'End Time' },
        cell: 'end',
        type: 'date',
        sortable: true,
        hide: { label: 'End Time', visible: true }
      },
      {
        header: { key: 'programmingStatus', label: 'Status' },
        cell: 'programmingStatus',
        type: 'text',
        sortable: true,
        hide: { label: 'Status', visible: true }
      },
      {
        header: { key: 'resourceType', label: 'Resource Type' },
        cell: 'resourceType',
        type: 'text',
        sortable: true,
        hide: { label: 'Resource Type', visible: true }
      },
      {
        header: { key: 'resourceId', label: 'Resource ID' },
        cell: 'resourceId',
        type: 'text',
        sortable: true,
        hide: { label: 'Resource ID', visible: true }
      },
      {
        header: { key: 'actions', label: 'Actions' },
        cell: 'actions',
        type: 'template',
        sortable: false,
        hide: { label: 'Actions', visible: true }
      }
    ];

    this.unscheduledTasksColumns = [
      {
        header: { key: 'title', label: 'Task Title' },
        cell: 'title',
        type: 'text',
        sortable: true,
        hide: { label: 'Task Title', visible: true }
      },
      {
        header: { key: 'description', label: 'Description' },
        cell: 'description',
        type: 'text',
        sortable: true,
        hide: { label: 'Description', visible: true }
      },
      {
        header: { key: 'status', label: 'Status' },
        cell: 'status',
        type: 'text',
        sortable: true,
        hide: { label: 'Status', visible: true }
      },
      {
        header: { key: 'employeeId', label: 'Employee ID' },
        cell: 'employeeId',
        type: 'text',
        sortable: true,
        hide: { label: 'Employee ID', visible: true }
      },
      {
        header: { key: 'actions', label: 'Actions' },
        cell: 'actions',
        type: 'template',
        sortable: false,
        hide: { label: 'Actions', visible: true }
      }
    ];
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.loadTasksForDate(date);
    this.saveState();
  }

  loadTasksForDate(date: Date): void {
    // Load all task programmings for the selected date
    this.taskProgrammingService.getAllTaskProgrammings().subscribe({
      next: (programmings) => {
        this.taskProgrammings = programmings.filter(p => {
          if (!p.start) return false;
          const programmingDate = new Date(p.start);
          return (
            programmingDate.getFullYear() === date.getFullYear() &&
            programmingDate.getMonth() === date.getMonth() &&
            programmingDate.getDate() === date.getDate()
          );
        });
        this.generateCalendarEvents();
        this.saveState();
      },
      error: (error) => {
        console.error('Error loading task programmings:', error);
        this.snackBar.open('Error loading scheduled tasks', 'Close', { duration: 3000 });
      }
    });

    // Load unscheduled tasks
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        // Filter tasks that don't have programming for this date
        const scheduledTaskIds = this.taskProgrammings.map(tp => tp.taskId);
        this.unscheduledTasks = tasks.filter(task => !scheduledTaskIds.includes(task.taskId));
        this.filteredUnscheduledTasks = [...this.unscheduledTasks];
        this.searchTasks();
        this.saveState();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
      }
    });
  }

  generateCalendarEvents(): void {
    this.events = this.taskProgrammings.map(programming => ({
      id: programming.taskProgrammingId,
      title: `Task ${programming.taskId} - ${programming.programmingStatus}`,
      start: programming.start || new Date(),
      end: programming.end || addHours(programming.start || new Date(), 1),
      meta: programming
    }));
    this.refresh.next(true);
  }

  onTaskDropped(event: CdkDragDrop<any[]>): void {
    // Handle task dropped from one container to another
    console.log('Task dropped:', event);
  }

  onDragStart(event: DragEvent, task: Task): void {
    this.draggingTask = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({ type: 'task', data: task }));
    }
  }

  onDragStartScheduled(event: DragEvent, programming: TaskProgramming): void {
    this.draggingTask = true;
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({ 
        type: 'programming', 
        data: programming 
      }));
    }
  }

  onDragEnd(): void {
    this.draggingTask = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, timeSlot: string): void {
    event.preventDefault();
    
    if (event.dataTransfer) {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      
      if (data.type === 'task') {
        this.handleUnscheduledTaskDrop(event, timeSlot);
      } else if (data.type === 'programming') {
        this.handleScheduledTaskDrop(event, timeSlot);
      }
    }
    
    this.onDragEnd();
  }

  onDropOutside(event: DragEvent): void {
    event.preventDefault();
    
    if (event.dataTransfer) {
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      
      if (data.type === 'programming') {
        const programming = data.data as TaskProgramming;
        this.unscheduleTask(programming);
      }
    }
    
    this.onDragEnd();
  }

  handleUnscheduledTaskDrop(event: DragEvent, timeSlot: string): void {
    if (!event.dataTransfer) return;
    
    const data = JSON.parse(event.dataTransfer.getData('application/json'));
    const task = data.data as Task;
    
    this.scheduleTask(task, timeSlot);
  }

  handleScheduledTaskDrop(event: DragEvent, timeSlot: string): void {
    if (!event.dataTransfer) return;
    
    const data = JSON.parse(event.dataTransfer.getData('application/json'));
    const programming = data.data as TaskProgramming;
    
    const [hourStr] = timeSlot.split(':');
    const newHour = parseInt(hourStr, 10);
    
    this.rescheduleTask(programming, newHour);
  }

  scheduleTask(task: Task, timeSlot: string): void {
    const [hourStr, minuteStr] = timeSlot.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    const startTime = new Date(this.selectedDate);
    startTime.setHours(hour, minute, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, minute, 0, 0); // Default 1 hour duration
    
    const newProgramming = new TaskProgramming(
      0, // Will be set by backend
      0, // Will be set by backend
      'PENDING',
      task.taskId,
      'EQUIPMENT', // Default resource type
      1, // Default resource ID
      startTime,
      endTime
    );
    
    this.taskProgrammingService.addTaskProgramming(newProgramming).subscribe({
      next: (createdProgramming) => {
        this.taskProgrammings.push(createdProgramming);
        this.unscheduledTasks = this.unscheduledTasks.filter(t => t.taskId !== task.taskId);
        this.searchTasks();
        this.generateCalendarEvents();
        this.saveState();
        this.snackBar.open('Task scheduled successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error scheduling task:', error);
        this.snackBar.open('Error scheduling task', 'Close', { duration: 3000 });
      }
    });
  }

  rescheduleTask(programming: TaskProgramming, newHour: number): void {
    if (!programming.start || !programming.end) return;
    
    const newStart = new Date(programming.start);
    newStart.setHours(newHour);
    
    const duration = programming.end.getTime() - programming.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);
    
    this.taskProgrammingService.updateTaskProgrammingTimeInterval(
      programming.taskProgrammingId, 
      newStart, 
      newEnd
    ).subscribe({
      next: (updatedProgramming) => {
        const index = this.taskProgrammings.findIndex(tp => tp.taskProgrammingId === programming.taskProgrammingId);
        if (index !== -1) {
          this.taskProgrammings[index] = updatedProgramming;
          this.generateCalendarEvents();
          this.saveState();
        }
        this.snackBar.open('Task rescheduled successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error rescheduling task:', error);
        this.snackBar.open('Error rescheduling task', 'Close', { duration: 3000 });
      }
    });
  }

  unscheduleTask(programming: TaskProgramming): void {
    // Find the task associated with this programming
    if (!programming.taskId) return;
    
    this.taskService.getTaskById(programming.taskId).subscribe({
      next: (task) => {
        // Remove programming from scheduled list
        this.taskProgrammings = this.taskProgrammings.filter(tp => tp.taskProgrammingId !== programming.taskProgrammingId);
        
        // Add task back to unscheduled list
        this.unscheduledTasks.push(task);
        this.searchTasks();
        this.generateCalendarEvents();
        this.saveState();
        
        this.snackBar.open('Task unscheduled successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error unscheduling task:', error);
        this.snackBar.open('Error unscheduling task', 'Close', { duration: 3000 });
      }
    });
  }

  cancelScheduling(programming: TaskProgramming): void {
    this.taskProgrammingService.updateTaskProgrammingStatus(programming.taskProgrammingId, 'CANCELLED').subscribe({
      next: (updatedProgramming) => {
        const index = this.taskProgrammings.findIndex(tp => tp.taskProgrammingId === programming.taskProgrammingId);
        if (index !== -1) {
          this.taskProgrammings[index] = updatedProgramming;
          this.generateCalendarEvents();
          this.saveState();
        }
        this.snackBar.open('Task programming cancelled', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error cancelling task programming:', error);
        this.snackBar.open('Error cancelling task programming', 'Close', { duration: 3000 });
      }
    });
  }

  eventTimesChanged(event: any): void {
    // Handle calendar event time changes
    const programming = event.event.meta as TaskProgramming;
    
    this.taskProgrammingService.updateTaskProgrammingTimeInterval(
      programming.taskProgrammingId,
      event.newStart,
      event.newEnd || addHours(event.newStart, 1)
    ).subscribe({
      next: (updatedProgramming) => {
        const index = this.taskProgrammings.findIndex(tp => tp.taskProgrammingId === programming.taskProgrammingId);
        if (index !== -1) {
          this.taskProgrammings[index] = updatedProgramming;
          this.generateCalendarEvents();
          this.saveState();
        }
      },
      error: (error) => {
        console.error('Error updating task programming times:', error);
        this.snackBar.open('Error updating task times', 'Close', { duration: 3000 });
      }
    });
  }

  onCalendarEventClick(event: { event: CalendarEvent }): void {
    const programming = event.event.meta as TaskProgramming;
    this.openSchedulingDialog(undefined, programming);
  }

  searchTasks(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUnscheduledTasks = [...this.unscheduledTasks];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUnscheduledTasks = this.unscheduledTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.status.toLowerCase().includes(searchLower)
      );
    }
    this.saveState();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'IN_PROGRESS': 'status-in-progress', 
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  }

  openSchedulingDialog(task?: Task, programming?: TaskProgramming): void {
    const dialogRef = this.dialog.open(TaskSchedulingDialogComponent, {
      data: {
        task,
        programming,
        selectedDate: this.selectedDate,
        mode: programming ? 'edit' : 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasksForDate(this.selectedDate);
      }
    });
  }

  handleScheduledTaskSelection(taskProgramming: TaskProgramming): void {
    this.openSchedulingDialog(undefined, taskProgramming);
  }

  handleUnscheduledTaskSelection(task: Task): void {
    this.openSchedulingDialog(task);
  }

  onSortScheduledChange(sort: Sort): void {
    this.scheduledTasksSort = sort;
    this.saveState();
  }

  onSortUnscheduledChange(sort: Sort): void {
    this.unscheduledTasksSort = sort;
    this.saveState();
  }

  getProgrammingById(id: string | number | undefined): TaskProgramming {
    return this.taskProgrammings.find(tp => tp.taskProgrammingId == id) || new TaskProgramming();
  }

  private loadState() {
    const savedState = this.localStorageService.getItem<StorageState>(this.STORAGE_KEY, {
      taskProgrammings: [],
      unscheduledTasks: [],
      viewMode: 'calendar',
      searchTerm: '',
      scheduledTasksSort: { active: 'start', direction: SortDirection.ASC },
      unscheduledTasksSort: { active: 'title', direction: SortDirection.ASC },
      selectedDate: new Date().toISOString(),
      statusFilter: '',
      startDate: null,
      endDate: null,
      showCompleted: true,
      groupBy: 'none'
    });

    this.taskProgrammings = savedState.taskProgrammings;
    this.unscheduledTasks = savedState.unscheduledTasks;
    this.viewMode = savedState.viewMode;
    this.searchTerm = savedState.searchTerm;
    this.scheduledTasksSort = savedState.scheduledTasksSort;
    this.unscheduledTasksSort = savedState.unscheduledTasksSort;
    this.selectedDate = new Date(savedState.selectedDate);
    this.statusFilter = savedState.statusFilter;
    this.startDate = savedState.startDate ? new Date(savedState.startDate) : null;
    this.endDate = savedState.endDate ? new Date(savedState.endDate) : null;
    this.showCompleted = savedState.showCompleted;
    this.groupBy = savedState.groupBy;
    
    this.filteredUnscheduledTasks = [...this.unscheduledTasks];
  }

  private saveState() {
    const state: StorageState = {
      taskProgrammings: this.taskProgrammings,
      unscheduledTasks: this.unscheduledTasks,
      viewMode: this.viewMode,
      searchTerm: this.searchTerm,
      scheduledTasksSort: this.scheduledTasksSort,
      unscheduledTasksSort: this.unscheduledTasksSort,
      selectedDate: this.selectedDate.toISOString(),
      statusFilter: this.statusFilter,
      startDate: this.startDate?.toISOString() || null,
      endDate: this.endDate?.toISOString() || null,
      showCompleted: this.showCompleted,
      groupBy: this.groupBy
    };

    this.localStorageService.setItem(this.STORAGE_KEY, state);
  }
}
