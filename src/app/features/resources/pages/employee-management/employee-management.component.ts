import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { Employee } from '../../models/employee.entity';
import { Position } from '../../models/position.entity';
import { Columns } from '../../../../shared/components/table/table.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFormDialogComponent } from '../../components/employee-form-dialog/employee-form-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../services/employee.service';
import { PositionService } from '../../services/position.service';
import { UiService } from '../../../../core/services/ui.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { finalize, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    SelectorComponent,
    FormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {
  // Data sources
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  positions: Position[] = [];
  loading: boolean = false;

  // Filter options
  statusFilter: string = 'all';
  positionFilter: string = 'all';
  
  statusFilterOptions: string[] = ['all', 'ACTIVE', 'INACTIVE', 'ON_LEAVE'];
  positionFilterOptions: string[] = ['all'];

  // Table configuration
  columns: Columns[] = [
    {
      header: { key: 'fullName', label: 'Full Name' },
      cell: 'fullName',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Name' }
    },
    {
      header: { key: 'email', label: 'Email' },
      cell: 'email',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Email' }
    },
    {
      header: { key: 'phoneNumber', label: 'Phone' },
      cell: 'phoneNumber',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Phone' }
    },
    {
      header: { key: 'positionTitle', label: 'Position' },
      cell: 'positionTitle',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Position' }
    },
    {
      header: { key: 'status', label: 'Status' },
      cell: 'status',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Status' }
    },
    {
      header: { key: 'actions', label: 'Actions' },
      cell: 'actions',
      type: 'template',
      sortable: false,
      hide: { visible: true, label: 'Actions' }
    }
  ];

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private uiService: UiService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load employees and positions in parallel
    forkJoin({
      employees: this.employeeService.getAllEmployees().pipe(
        catchError(error => {
          console.error('Error loading employees:', error);
          return of([]);
        })
      ),
      positions: this.positionService.getAllPositions().pipe(
        catchError(error => {
          console.error('Error loading positions:', error);
          return of([]);
        })
      )
    })
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: ({ employees, positions }) => {
        this.employees = employees;
        this.positions = positions;
        
        // Update position filter options
        this.positionFilterOptions = ['all', ...positions.map(p => p.title)];
        
        this.applyFilters();
        
        this.uiService.showSnackbar({
          message: 'Data loaded successfully',
          type: 'success'
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.uiService.showSnackbar({
          message: 'Error loading data',
          type: 'error'
        });
      }
    });
  }

  applyFilters(): void {
    let filtered: Employee[] = [...this.employees];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === this.statusFilter);
    }

    // Apply position filter
    if (this.positionFilter !== 'all') {
      filtered = filtered.filter(employee => employee.positionTitle === this.positionFilter);
    }

    this.filteredEmployees = filtered;
  }

  onStatusFilterChange(status: string | string[]): void {
    this.statusFilter = Array.isArray(status) ? status[0] || 'all' : status || 'all';
    this.applyFilters();
  }

  onPositionFilterChange(position: string | string[]): void {
    this.positionFilter = Array.isArray(position) ? position[0] || 'all' : position || 'all';
    this.applyFilters();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        employee: new Employee(),
        title: 'Add Employee',
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEmployee(result);
      }
    });
  }

  openEditDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        employee: { ...employee },
        title: 'Edit Employee',
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEmployee(result);
      }
    });
  }

  createEmployee(employee: Employee): void {
    this.loading = true;
    
    this.employeeService.createEmployee(employee)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdEmployee) => {
          this.employees.push(createdEmployee);
          this.applyFilters();
          
          this.uiService.showSnackbar({
            message: 'Employee created successfully',
            type: 'success'
          });
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.uiService.showSnackbar({
            message: 'Error creating employee',
            type: 'error'
          });
        }
      });
  }

  updateEmployee(employee: Employee): void {
    this.loading = true;
    
    this.employeeService.updateEmployeeStatus(employee.id, employee.status)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedEmployee) => {
          const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
          if (index !== -1) {
            this.employees[index] = updatedEmployee;
            this.applyFilters();
          }
          
          this.uiService.showSnackbar({
            message: 'Employee updated successfully',
            type: 'success'
          });
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.uiService.showSnackbar({
            message: 'Error updating employee',
            type: 'error'
          });
        }
      });
  }

  deleteEmployee(employee: Employee): void {
    this.dialogService.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete employee ${employee.fullName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.performDelete(employee);
      }
    });
  }

  private performDelete(employee: Employee): void {
    // Since backend doesn't have delete endpoint, we'll update status to INACTIVE
    this.loading = true;
    
    this.employeeService.updateEmployeeStatus(employee.id, 'INACTIVE')
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          const index = this.employees.findIndex(e => e.id === employee.id);
          if (index !== -1) {
            this.employees[index].status = 'INACTIVE';
            this.applyFilters();
          }
          
          this.uiService.showSnackbar({
            message: 'Employee deactivated successfully',
            type: 'success'
          });
        },
        error: (error) => {
          console.error('Error deactivating employee:', error);
          this.uiService.showSnackbar({
            message: 'Error deactivating employee',
            type: 'error'
          });
        }
      });
  }

  refreshData(): void {
    this.loadData();
  }
}
