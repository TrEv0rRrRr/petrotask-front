import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { Equipment } from '../../models/equipment.entity';
import { Columns } from '../../../../shared/components/table/table.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';
import { FormsModule } from '@angular/forms';
import { EquipmentFormDialogComponent } from '../../components/equipment-form-dialog/equipment-form-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentService } from '../../services/equipment.service';
import { UiService } from '../../../../core/services/ui.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { finalize } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-equipment-management',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    SelectorComponent,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss'
})
export class EquipmentManagementComponent implements OnInit {
  // View mode toggle
  viewMode: 'table' | 'cards' = 'table';

  // Data sources
  equipment: Equipment[] = [];
  filteredEquipment: Equipment[] = [];
  loading: boolean = false;

  // Filter options
  statusFilter: string = 'all';
  statusFilterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
    { value: 'RESERVED', label: 'Reserved' }
  ];

  // Table configuration
  columns: Columns[] = [
    {
      header: { key: 'name', label: 'Equipment Name' },
      cell: 'name',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Name' }
    },
    {
      header: { key: 'code', label: 'Code' },
      cell: 'code',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Code' }
    },
    {
      header: { key: 'plate', label: 'License Plate' },
      cell: 'plate',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Plate' }
    },
    {
      header: { key: 'capacityLoad', label: 'Load Capacity (kg)' },
      cell: 'capacityLoad',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Load Capacity' }
    },
    {
      header: { key: 'capacityPax', label: 'Passenger Capacity' },
      cell: 'capacityPax',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Passenger Capacity' }
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
    private equipmentService: EquipmentService,
    private uiService: UiService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadEquipment();
  }

  // New methods to fix linter errors
  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  trackByEquipmentId(index: number, equipment: Equipment): number {
    return equipment.id;
  }

  getEquipmentIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'AVAILABLE': 'check_circle',
      'MAINTENANCE': 'build',
      'OUT_OF_SERVICE': 'block',
      'RESERVED': 'lock'
    };
    return iconMap[status] || 'help';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'AVAILABLE': 'check_circle',
      'MAINTENANCE': 'build',
      'OUT_OF_SERVICE': 'block',
      'RESERVED': 'lock'
    };
    return iconMap[status] || 'help';
  }

  getLastMaintenanceText(equipment: Equipment): string {
    // This is a placeholder since we don't have maintenance date in the model
    return 'Not available';
  }

  // Fixed selector change method
  onStatusFilterChange(status: string | string[]): void {
    this.statusFilter = Array.isArray(status) ? status[0] || 'all' : status || 'all';
    this.applyFilters();
  }

  loadEquipment(): void {
    this.loading = true;
    
    this.equipmentService.getAllEquipment()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading equipment:', error);
          this.uiService.showSnackbar({
            message: 'Error loading equipment data',
            type: 'error'
          });
          return of([]);
        })
      )
      .subscribe({
        next: (equipment: Equipment[]) => {
          this.equipment = equipment;
          this.applyFilters();
          
          this.uiService.showSnackbar({
            message: 'Equipment data loaded successfully',
            type: 'success'
          });
        }
      });
  }

  // Toggle view mode between table and cards
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  // Apply filters
  applyFilters(): void {
    let filtered: Equipment[] = [...this.equipment];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(equipment => equipment.status === this.statusFilter);
    }

    this.filteredEquipment = filtered;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EquipmentFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        equipment: new Equipment({}),
        title: 'Add Equipment',
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEquipment(result);
      }
    });
  }

  openEditDialog(equipment: Equipment): void {
    const dialogRef = this.dialog.open(EquipmentFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        equipment: { ...equipment },
        title: 'Edit Equipment',
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEquipment(result);
      }
    });
  }

  createEquipment(equipment: Equipment): void {
    this.loading = true;
    
    this.equipmentService.createEquipment(equipment)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdEquipment: Equipment) => {
          this.equipment.push(createdEquipment);
          this.applyFilters();
          
          this.uiService.showSnackbar({
            message: 'Equipment created successfully',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error creating equipment:', error);
          this.uiService.showSnackbar({
            message: 'Error creating equipment',
            type: 'error'
          });
        }
      });
  }

  updateEquipment(equipment: Equipment): void {
    this.loading = true;
    
    this.equipmentService.updateEquipmentStatus(equipment.id, equipment.status)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedEquipment: Equipment) => {
          const index = this.equipment.findIndex(e => e.id === updatedEquipment.id);
          if (index !== -1) {
            this.equipment[index] = updatedEquipment;
            this.applyFilters();
          }
          
          this.uiService.showSnackbar({
            message: 'Equipment updated successfully',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error updating equipment:', error);
          this.uiService.showSnackbar({
            message: 'Error updating equipment',
            type: 'error'
          });
        }
      });
  }

  deleteEquipment(equipment: Equipment): void {
    this.dialogService.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to mark equipment ${equipment.name} as out of service?`,
      confirmText: 'Mark Out of Service',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.performDelete(equipment);
      }
    });
  }

  private performDelete(equipment: Equipment): void {
    // Since backend doesn't have delete endpoint, we'll update status to OUT_OF_SERVICE
    this.loading = true;
    
    this.equipmentService.updateEquipmentStatus(equipment.id, 'OUT_OF_SERVICE')
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          const index = this.equipment.findIndex(e => e.id === equipment.id);
          if (index !== -1) {
            this.equipment[index].status = 'OUT_OF_SERVICE';
            this.applyFilters();
          }
          
          this.uiService.showSnackbar({
            message: 'Equipment marked as out of service',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error updating equipment status:', error);
          this.uiService.showSnackbar({
            message: 'Error updating equipment status',
            type: 'error'
          });
        }
      });
  }

  changeStatus(equipment: Equipment, newStatus: string): void {
    this.loading = true;
    
    this.equipmentService.updateEquipmentStatus(equipment.id, newStatus)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedEquipment: Equipment) => {
          const index = this.equipment.findIndex(e => e.id === updatedEquipment.id);
          if (index !== -1) {
            this.equipment[index] = updatedEquipment;
            this.applyFilters();
          }
          
          this.uiService.showSnackbar({
            message: 'Equipment status updated successfully',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error updating equipment status:', error);
          this.uiService.showSnackbar({
            message: 'Error updating equipment status',
            type: 'error'
          });
        }
      });
  }

  refreshData(): void {
    this.loadEquipment();
  }

  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      'AVAILABLE': 'Available',
      'MAINTENANCE': 'Under Maintenance',
      'OUT_OF_SERVICE': 'Out of Service',
      'RESERVED': 'Reserved'
    };
    return statusMap[status] || status;
  }
}
