import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TaskProgramming } from '../../model/task-programming.entity';
import { Task } from '../../model/task.entity';
import { TaskProgrammingService } from '../../services/task-programming.service';
import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import { DialogService } from '../../../../shared/services/dialog.service';

interface StorageState {
  taskProgrammings: TaskProgramming[];
  filters: {
    status: string;
    resourceType: string;
    searchTerm: string;
    dateRange: {
      start: string | null;
      end: string | null;
    };
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  sorting: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

@Component({
  selector: 'app-task-programming-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    TranslateModule,
    TranslatePipe
  ],
  templateUrl: './task-programming-management.component.html',
  styleUrls: ['./task-programming-management.component.scss']
})
export class TaskProgrammingManagementComponent implements OnInit {
  taskProgrammings: TaskProgramming[] = [];
  filteredProgrammings: TaskProgramming[] = [];
  displayedProgrammings: TaskProgramming[] = [];
  
  // Table configuration
  displayedColumns: string[] = [
    'taskProgrammingId',
    'taskId', 
    'reservationId',
    'programmingStatus',
    'resourceType',
    'resourceId',
    'start',
    'end',
    'actions'
  ];
  
  // Pagination
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageIndex = 0;
  totalProgrammings = 0;
  
  // Filters
  statusFilter: string = '';
  resourceTypeFilter: string = '';
  searchQuery: string = '';
  startDateFilter: Date | null = null;
  endDateFilter: Date | null = null;
  
  // Sorting
  sortField: string = 'start';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Available filter options
  statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  resourceTypeOptions = ['EQUIPMENT', 'PERSONNEL', 'VEHICLE', 'FACILITY'];
  
  // Loading states
  loading = false;
  
  private localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'task_programming_management_state';

  constructor(
    private taskProgrammingService: TaskProgrammingService,
    private taskService: TaskService,
    private activityService: ActivityService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadState();
    this.loadTaskProgrammings();
  }

  private loadState() {
    const savedState = this.localStorageService.getItem<StorageState>(this.STORAGE_KEY, {
      taskProgrammings: [],
      filters: {
        status: '',
        resourceType: '',
        searchTerm: '',
        dateRange: {
          start: null,
          end: null
        }
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10
      },
      sorting: {
        field: 'start',
        direction: 'desc'
      }
    });

    this.statusFilter = savedState.filters.status;
    this.resourceTypeFilter = savedState.filters.resourceType;
    this.searchQuery = savedState.filters.searchTerm;
    this.startDateFilter = savedState.filters.dateRange.start ? new Date(savedState.filters.dateRange.start) : null;
    this.endDateFilter = savedState.filters.dateRange.end ? new Date(savedState.filters.dateRange.end) : null;
    this.pageIndex = savedState.pagination.currentPage - 1;
    this.pageSize = savedState.pagination.itemsPerPage;
    this.sortField = savedState.sorting.field;
    this.sortDirection = savedState.sorting.direction;
    this.taskProgrammings = savedState.taskProgrammings;
  }

  private saveState() {
    const state: StorageState = {
      taskProgrammings: this.taskProgrammings,
      filters: {
        status: this.statusFilter,
        resourceType: this.resourceTypeFilter,
        searchTerm: this.searchQuery,
        dateRange: {
          start: this.startDateFilter?.toISOString() || null,
          end: this.endDateFilter?.toISOString() || null
        }
      },
      pagination: {
        currentPage: this.pageIndex + 1,
        itemsPerPage: this.pageSize
      },
      sorting: {
        field: this.sortField,
        direction: this.sortDirection
      }
    };

    this.localStorageService.setItem(this.STORAGE_KEY, state);
  }

  loadTaskProgrammings(): void {
    this.loading = true;
    this.taskProgrammingService.getAllTaskProgrammings().subscribe({
      next: (programmings) => {
        this.taskProgrammings = programmings;
        this.loading = false;
        this.saveState();
        this.applyFilters();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error loading task programmings', 'Close', {
          duration: 3000
        });
        console.error('Error loading task programmings:', error);
      }
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.filterProgrammings();
    this.saveState();
  }

  filterProgrammings(): void {
    let filtered = [...this.taskProgrammings];

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(programming => programming.programmingStatus === this.statusFilter);
    }

    // Filter by resource type
    if (this.resourceTypeFilter) {
      filtered = filtered.filter(programming => programming.resourceType === this.resourceTypeFilter);
    }

    // Filter by date range
    if (this.startDateFilter && this.endDateFilter) {
      filtered = filtered.filter(programming => {
        if (!programming.start) return false;
        const programmingDate = new Date(programming.start);
        return programmingDate >= this.startDateFilter! && programmingDate <= this.endDateFilter!;
      });
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(programming =>
        programming.taskProgrammingId.toString().includes(query) ||
        programming.taskId?.toString().includes(query) ||
        programming.reservationId.toString().includes(query) ||
        programming.programmingStatus.toLowerCase().includes(query) ||
        programming.resourceType?.toLowerCase().includes(query) ||
        programming.resourceId?.toString().includes(query)
      );
    }

    this.totalProgrammings = filtered.length;

    // Apply sorting
    this.sortProgrammings(filtered);

    // Apply pagination
    this.filteredProgrammings = filtered.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  private sortProgrammings(programmings: TaskProgramming[]): void {
    programmings.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortField) {
        case 'taskProgrammingId':
          aValue = a.taskProgrammingId;
          bValue = b.taskProgrammingId;
          break;
        case 'taskId':
          aValue = a.taskId || 0;
          bValue = b.taskId || 0;
          break;
        case 'reservationId':
          aValue = a.reservationId;
          bValue = b.reservationId;
          break;
        case 'programmingStatus':
          aValue = a.programmingStatus;
          bValue = b.programmingStatus;
          break;
        case 'resourceType':
          aValue = a.resourceType || '';
          bValue = b.resourceType || '';
          break;
        case 'resourceId':
          aValue = a.resourceId || 0;
          bValue = b.resourceId || 0;
          break;
        case 'start':
          aValue = a.start ? new Date(a.start) : new Date(0);
          bValue = b.start ? new Date(b.start) : new Date(0);
          break;
        case 'end':
          aValue = a.end ? new Date(a.end) : new Date(0);
          bValue = b.end ? new Date(b.end) : new Date(0);
          break;
        default:
          aValue = a.start ? new Date(a.start) : new Date(0);
          bValue = b.start ? new Date(b.start) : new Date(0);
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

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  onSortChange(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction as 'asc' | 'desc';
    this.applyFilters();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.resourceTypeFilter = '';
    this.searchQuery = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
    this.applyFilters();
  }

  createTaskProgramming(): void {
    // Open dialog to create new task programming
    // For now, create a simple mock programming
    const newProgramming = new TaskProgramming(
      0,
      Date.now(),
      'PENDING',
      1, // Mock task ID
      'EQUIPMENT',
      1,
      new Date(),
      new Date(Date.now() + 3600000) // 1 hour later
    );

    this.taskProgrammingService.addTaskProgramming(newProgramming).subscribe({
      next: (createdProgramming) => {
        this.taskProgrammings.push(createdProgramming);
        this.applyFilters();
        this.snackBar.open('Task programming created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error creating task programming', 'Close', { duration: 3000 });
        console.error('Error creating task programming:', error);
      }
    });
  }

  editTaskProgramming(programming: TaskProgramming): void {
    // Open edit dialog
    this.snackBar.open('Edit functionality coming soon', 'Close', { duration: 2000 });
  }

  updateProgrammingStatus(programming: TaskProgramming, newStatus: string): void {
    this.taskProgrammingService.updateTaskProgrammingStatus(programming.taskProgrammingId, newStatus).subscribe({
      next: (updatedProgramming) => {
        const index = this.taskProgrammings.findIndex(tp => tp.taskProgrammingId === programming.taskProgrammingId);
        if (index !== -1) {
          this.taskProgrammings[index] = updatedProgramming;
          this.applyFilters();
        }
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
        console.error('Error updating status:', error);
      }
    });
  }

  updateTimeInterval(programming: TaskProgramming): void {
    // Open time interval edit dialog
    this.snackBar.open('Time interval edit functionality coming soon', 'Close', { duration: 2000 });
  }

  deleteProgramming(programming: TaskProgramming): void {
    this.dialogService.confirm({
      title: 'Delete Task Programming',
      message: `Are you sure you want to delete task programming ${programming.taskProgrammingId}?`
    }).subscribe(result => {
      if (result) {
        // Since we don't have a delete endpoint, remove locally
        this.taskProgrammings = this.taskProgrammings.filter(tp => tp.taskProgrammingId !== programming.taskProgrammingId);
        this.applyFilters();
        this.snackBar.open('Task programming deleted successfully', 'Close', { duration: 3000 });
      }
    });
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

  getResourceTypeIcon(resourceType: string): string {
    const typeIcons: { [key: string]: string } = {
      'EQUIPMENT': 'build',
      'PERSONNEL': 'person',
      'VEHICLE': 'directions_car',
      'FACILITY': 'business'
    };
    return typeIcons[resourceType] || 'help_outline';
  }

  formatDateTime(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  exportToCSV(): void {
    // Basic CSV export functionality
    this.snackBar.open('Export functionality coming soon', 'Close', { duration: 2000 });
  }

  refreshData(): void {
    this.loadTaskProgrammings();
  }
} 