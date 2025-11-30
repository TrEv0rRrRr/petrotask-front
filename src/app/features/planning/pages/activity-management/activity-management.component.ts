import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Activity } from '../../model/activity.entity';
import { Task } from '../../model/task.entity';
import { ActivityListComponent } from '../../components/activity-list/activity-list.component';
import { DateNavigatorComponent } from '../../../../shared/components/date-navigator/date-navigator.component';
import { ActivityService } from '../../services/activity.service';
import { TaskService } from '../../services/task.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ActivityDialogComponent } from '../../components/activity-dialog/activity-dialog.component';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';

interface StorageState {
  activities: Activity[];
  filters: {
    status: string;
    searchTerm: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  };
  selectedDate: string;
}

@Component({
  selector: 'app-activity-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    ActivityListComponent,
    DateNavigatorComponent,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './activity-management.component.html',
  styleUrls: ['./activity-management.component.scss']
})
export class ActivityManagementComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  displayedActivities: Activity[] = [];

  selectedDate: Date = new Date();

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;
  totalActivities = 0;

  // Filters
  statusFilter: string = '';
  searchQuery: string = '';

  sortField: string = 'expectedTime';
  sortDirection: 'asc' | 'desc' = 'desc';

  private localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'activity_management_state';

  constructor(
    private snackBar: MatSnackBar,
    private activityService: ActivityService,
    private taskService: TaskService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadState();
    this.loadActivities();
  }

  private loadState() {
    const savedState = this.localStorageService.getItem<StorageState>(this.STORAGE_KEY, {
      activities: [],
      filters: {
        status: '',
        searchTerm: ''
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10
      },
      sorting: {
        field: 'expectedTime',
        direction: 'desc'
      },
      selectedDate: new Date().toISOString()
    });

    this.statusFilter = savedState.filters.status;
    this.searchQuery = savedState.filters.searchTerm;
    this.pageIndex = savedState.pagination.currentPage - 1;
    this.pageSize = savedState.pagination.itemsPerPage;
    this.sortField = savedState.sorting.field;
    this.sortDirection = savedState.sorting.direction;
    this.selectedDate = new Date(savedState.selectedDate);
    this.activities = savedState.activities;
  }

  private saveState() {
    const state: StorageState = {
      activities: this.activities,
      filters: {
        status: this.statusFilter,
        searchTerm: this.searchQuery
      },
      pagination: {
        currentPage: this.pageIndex + 1,
        itemsPerPage: this.pageSize
      },
      sorting: {
        field: this.sortField,
        direction: this.sortDirection
      },
      selectedDate: this.selectedDate.toISOString()
    };

    this.localStorageService.setItem(this.STORAGE_KEY, state);
  }

  loadActivities(): void {
    this.activityService.getAllActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
        this.saveState();
        this.applyFilters();
      },
      error: (error) => {
        this.snackBar.open(this.translate.instant('activity-management.messages.error-load'), 'Cerrar', {
          duration: 3000
        });
        console.error('Error loading activities:', error);
      }
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.filterActivities();
    this.saveState();
  }

  filterActivities(): void {
    let filtered = [...this.activities];

    // Filter by date (comparing only year, month, and day)
    if (this.selectedDate) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.expectedTime);
        return (
          activityDate.getFullYear() === this.selectedDate.getFullYear() &&
          activityDate.getMonth() === this.selectedDate.getMonth() &&
          activityDate.getDate() === this.selectedDate.getDate()
        );
      });
    }

    if (this.statusFilter) {
      filtered = filtered.filter(activity => activity.activityStatus === this.statusFilter);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.activityCode.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query)
      );
    }

    this.totalActivities = filtered.length;

    // Apply sorting
    this.sortActivities(filtered);

    // Apply pagination
    this.filteredActivities = filtered.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
    this.pageIndex = 0; // Reset to first page
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  onEditActivity(activity: Activity): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: {
        activity,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Since we don't have a full update method, we'll update the status
        this.activityService.updateActivityStatus(activity.id, result.activityStatus).subscribe({
          next: (updatedActivity) => {
            const index = this.activities.findIndex(a => a.id === updatedActivity.id);
            if (index !== -1) {
              this.activities[index] = updatedActivity;
              this.saveState();
              this.applyFilters();
            }
            this.snackBar.open(this.translate.instant('activity-management.messages.update-success'), 'Cerrar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open(this.translate.instant('activity-management.messages.error-update'), 'Cerrar', {
              duration: 3000
            });
            console.error('Error updating activity:', error);
          }
        });
      }
    });
  }

  onDeleteActivity(activityId: number): void {
    this.dialogService.confirm({
      title: this.translate.instant('activity-management.actions.delete'),
      message: this.translate.instant('activity-management.messages.confirm-delete')
    }).subscribe(result => {
      if (result) {
        // Since we don't have a delete method, we'll filter it out locally for now
        // In a real implementation, you'd call a delete endpoint
        this.activities = this.activities.filter(a => a.id !== activityId);
        this.saveState();
        this.applyFilters();
        this.snackBar.open(this.translate.instant('activity-management.messages.delete-success'), 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        task,
        activityId: task.activityId,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update different aspects of the task based on what changed
        if (result.status !== task.status) {
          this.taskService.updateTaskStatus(task.taskId, result.status).subscribe({
            next: (updatedTask) => {
              this.updateTaskInActivities(updatedTask);
              this.snackBar.open('Task status updated successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              this.snackBar.open('Error updating task status', 'Close', {
                duration: 3000
              });
              console.error('Error updating task status:', error);
            }
          });
        }

        if (result.description !== task.description) {
          this.taskService.updateTaskDescription(task.taskId, result.description).subscribe({
            next: (updatedTask) => {
              this.updateTaskInActivities(updatedTask);
              this.snackBar.open('Task description updated successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              this.snackBar.open('Error updating task description', 'Close', {
                duration: 3000
              });
              console.error('Error updating task description:', error);
            }
          });
        }

        if (result.employeeId !== task.employeeId) {
          this.taskService.updateTaskEmployeeId(task.taskId, result.employeeId).subscribe({
            next: (updatedTask) => {
              this.updateTaskInActivities(updatedTask);
              this.snackBar.open('Task employee updated successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              this.snackBar.open('Error updating task employee', 'Close', {
                duration: 3000
              });
              console.error('Error updating task employee:', error);
            }
          });
        }
      }
    });
  }

  private updateTaskInActivities(updatedTask: Task): void {
    const activityIndex = this.activities.findIndex(a => a.id === updatedTask.activityId);
    if (activityIndex !== -1 && this.activities[activityIndex].tasks) {
      const taskIndex = this.activities[activityIndex].tasks!.findIndex(t => t.taskId === updatedTask.taskId);
      if (taskIndex !== -1) {
        this.activities[activityIndex].tasks![taskIndex] = updatedTask;
        this.saveState();
        this.applyFilters();
      }
    }
  }

  onDeleteTask(taskId: number): void {
    this.dialogService.confirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task?'
    }).subscribe(result => {
      if (result) {
        // Since we don't have a delete method, we'll filter it out locally
        this.activities = this.activities.map(activity => ({
          ...activity,
          tasks: activity.tasks ? activity.tasks.filter(t => t.taskId !== taskId) : []
        }));
        this.saveState();
        this.applyFilters();
        this.snackBar.open('Task deleted successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onAddTask(activityId: number): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        activityId,
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Set the activityId for the new task
        result.activityId = activityId;
        
        this.taskService.createTask(result).subscribe({
          next: (newTask) => {
            const activityIndex = this.activities.findIndex(a => a.id === activityId);
            if (activityIndex !== -1) {
              if (!this.activities[activityIndex].tasks) {
                this.activities[activityIndex].tasks = [];
              }
              this.activities[activityIndex].tasks!.push(newTask);
              this.saveState();
              this.applyFilters();
            }
            this.snackBar.open('Task created successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Error creating task', 'Close', {
              duration: 3000
            });
            console.error('Error creating task:', error);
          }
        });
      }
    });
  }

  createActivity(): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityService.createActivity(result).subscribe({
          next: (newActivity) => {
            this.activities.push(newActivity);
            this.saveState();
            this.applyFilters();
            this.snackBar.open('Activity created successfully', 'Close', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open('Error creating activity', 'Close', {
              duration: 3000
            });
            console.error('Error creating activity:', error);
          }
        });
      }
    });
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private sortActivities(activities: Activity[]): void {
    activities.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'activityCode':
          aValue = a.activityCode;
          bValue = b.activityCode;
          break;
        case 'expectedTime':
          aValue = new Date(a.expectedTime);
          bValue = new Date(b.expectedTime);
          break;
        case 'activityStatus':
          aValue = a.activityStatus;
          bValue = b.activityStatus;
          break;
        case 'weekNumber':
          aValue = a.weekNumber;
          bValue = b.weekNumber;
          break;
        default:
          aValue = a.expectedTime;
          bValue = b.expectedTime;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
