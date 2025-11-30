import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Position } from '../../models/position.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PositionService } from '../../services/position.service';
import { UiService } from '../../../../core/services/ui.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { PositionFormDialogComponent } from '../../components/position-form-dialog/position-form-dialog.component';
import { finalize } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-position-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InputComponent,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './position-management.component.html',
  styleUrl: './position-management.component.scss'
})
export class PositionManagementComponent implements OnInit {
  // Data sources
  positions: Position[] = [];
  loading: boolean = false;

  // View mode
  viewMode: 'table' | 'cards' = 'cards';

  // Search and filter properties
  searchTerm: string = '';
  
  constructor(
    private dialog: MatDialog,
    private positionService: PositionService,
    private uiService: UiService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  // Computed properties
  get filteredPositions(): Position[] {
    if (!this.searchTerm) {
      return this.positions;
    }
    
    return this.positions.filter(position => {
      return position.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             position.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  // Search methods
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  // View mode toggle
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'cards' ? 'table' : 'cards';
  }

  // TrackBy functions for performance
  trackByPositionId(index: number, position: Position): number {
    return position.id;
  }

  /**
   * Load all positions
   */
  loadPositions(): void {
    this.loading = true;
    
    this.positionService.getAllPositions().pipe(
      catchError(error => {
        console.error('Error loading positions:', error);
        this.uiService.showSnackbar({
          message: 'Error cargando posiciones',
          type: 'error'
        });
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (positions: Position[]) => {
        this.positions = positions;
        this.uiService.showSnackbar({
          message: 'Posiciones cargadas exitosamente',
          type: 'success'
        });
      },
      error: (error) => {
        console.error('Error loading positions:', error);
        this.uiService.showSnackbar({
          message: 'Error cargando datos',
          type: 'error'
        });
      }
    });
  }

  // Position operations
  openAddPositionDialog(): void {
    const dialogRef = this.dialog.open(PositionFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        position: new Position(0, 1, '', ''),
        title: 'POSITION_MANAGEMENT.ADD_POSITION',
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createPosition(result);
      }
    });
  }

  openEditPositionDialog(position: Position): void {
    const dialogRef = this.dialog.open(PositionFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        position: { ...position },
        title: 'POSITION_MANAGEMENT.EDIT_POSITION',
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePosition(result);
      }
    });
  }

  createPosition(position: Position): void {
    this.loading = true;
    
    this.positionService.createPosition(position)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdPosition: Position) => {
          this.positions.push(createdPosition);
          
          this.uiService.showSnackbar({
            message: 'Posición creada exitosamente',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error creating position:', error);
          this.uiService.showSnackbar({
            message: 'Error creando posición',
            type: 'error'
          });
        }
      });
  }

  updatePosition(position: Position): void {
    // Since backend doesn't have update endpoint, we'll simulate local update
    this.loading = true;
    
    setTimeout(() => {
      const index = this.positions.findIndex(p => p.id === position.id);
      if (index !== -1) {
        this.positions[index] = position;
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Posición actualizada exitosamente',
        type: 'success'
      });
    }, 1000);
  }

  deletePosition(position: Position): void {
    this.dialogService.confirm({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar la posición ${position.title}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.performDeletePosition(position);
      }
    });
  }

  private performDeletePosition(position: Position): void {
    // Since backend doesn't have delete endpoint, we'll simulate removal locally
    this.loading = true;
    
    setTimeout(() => {
      const index = this.positions.findIndex(p => p.id === position.id);
      if (index !== -1) {
        this.positions.splice(index, 1);
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Posición eliminada exitosamente',
        type: 'success'
      });
    }, 1000);
  }

  refreshData(): void {
    this.loadPositions();
  }

  // Position icon getter
  getPositionIcon(position: Position): string {
    // Simple logic to assign icons based on position title
    const title = position.title.toLowerCase();
    
    if (title.includes('gerente') || title.includes('director')) {
      return 'business_center';
    } else if (title.includes('operario') || title.includes('técnico')) {
      return 'engineering';
    } else if (title.includes('supervisor') || title.includes('jefe')) {
      return 'supervisor_account';
    } else if (title.includes('analista') || title.includes('especialista')) {
      return 'analytics';
    } else if (title.includes('asistente') || title.includes('auxiliar')) {
      return 'support_agent';
    }
    
    return 'work';
  }
} 