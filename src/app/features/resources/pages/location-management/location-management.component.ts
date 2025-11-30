import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Zone } from '../../models/zone.entity';
import { Location } from '../../models/location.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ZoneFormDialogComponent } from '../../components/zone-form-dialog/zone-form-dialog.component';
import { LocationFormDialogComponent } from '../../components/location-form-dialog/location-form-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { ZoneService, ZoneWithLocations } from '../../services/zone.service';
import { LocationService } from '../../services/location.service';
import { UiService } from '../../../../core/services/ui.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { finalize } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-management',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InputComponent,
    SelectorComponent,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './location-management.component.html',
  styleUrl: './location-management.component.scss'
})
export class LocationManagementComponent implements OnInit {
  // Data sources
  zones: Zone[] = [];
  loading: boolean = false;

  // Cache for zone locations - now populated automatically when zones are loaded
  private zoneLocationsCache: Map<number, Location[]> = new Map();

  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = '';

  // Status options for filtering
  statusOptions = [
    { value: 'ACTIVE', label: 'SHARED.STATUS.ACTIVE' },
    { value: 'INACTIVE', label: 'SHARED.STATUS.INACTIVE' }
  ];

  constructor(
    private dialog: MatDialog,
    private zoneService: ZoneService,
    private locationService: LocationService,
    private uiService: UiService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadZonesWithLocations();
  }

  // Computed properties
  get filteredZones(): Zone[] {
    if (!this.searchTerm) {
      return this.zones;
    }
    
    return this.zones.filter(zone => {
      // Search in zone name
      const zoneMatch = zone.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Search in zone locations
      const zoneLocations = this.getLocationsForZone(zone.id);
      const locationMatch = zoneLocations.some(location => 
        location.address?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        location.city?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        location.country?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      
      return zoneMatch || locationMatch;
    });
  }

  // Search and filter methods
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }

  onFilterStatus(status: string | string[]): void {
    this.statusFilter = Array.isArray(status) ? status[0] || '' : status || '';
  }

  // Zone and location utility methods
  getLocationsForZone(zoneId: number): Location[] {
    const zoneLocations = this.zoneLocationsCache.get(zoneId) || [];
    
    // Apply status filter if set
    if (this.statusFilter) {
      return zoneLocations.filter(location => location.status === this.statusFilter);
    }
    
    return zoneLocations;
  }

  getLocationCountForZone(zoneId: number): number {
    return this.zoneLocationsCache.get(zoneId)?.length || 0;
  }

  getActiveLocationCountForZone(zoneId: number): number {
    const zoneLocations = this.zoneLocationsCache.get(zoneId) || [];
    return zoneLocations.filter(location => location.status === 'ACTIVE').length;
  }

  // TrackBy functions for performance
  trackByZoneId(index: number, zone: Zone): number {
    return zone.id;
  }

  trackByLocationId(index: number, location: Location): number {
    return location.id;
  }

  /**
   * Load zones with their child locations automatically
   * This is more efficient than loading them separately
   */
  loadZonesWithLocations(): void {
    this.loading = true;
    this.zoneLocationsCache.clear();
    
    this.zoneService.getZonesWithLocations().pipe(
      catchError(error => {
        console.error('Error loading zones with locations:', error);
        this.uiService.showSnackbar({
          message: 'Error cargando zonas y ubicaciones',
          type: 'error'
        });
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (zonesWithLocations: ZoneWithLocations[]) => {
        // Extract zones and populate cache with locations
        this.zones = zonesWithLocations.map(zoneData => zoneData.zone);
        
        // Populate cache with each zone's locations
        zonesWithLocations.forEach(zoneData => {
          this.zoneLocationsCache.set(zoneData.zone.id, zoneData.locations);
        });
        
        this.uiService.showSnackbar({
          message: 'Zonas y ubicaciones cargadas exitosamente',
          type: 'success'
        });
      },
      error: (error) => {
        console.error('Error loading zones with locations:', error);
        this.uiService.showSnackbar({
          message: 'Error cargando datos',
          type: 'error'
        });
      }
    });
  }

  /**
   * Legacy method kept for backward compatibility
   * Now just calls loadZonesWithLocations
   */
  loadData(): void {
    this.loadZonesWithLocations();
  }

  // Zone operations
  openAddZoneDialog(): void {
    const dialogRef = this.dialog.open(ZoneFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        zone: new Zone(0, 1, ''),
        title: 'Agregar Zona',
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createZone(result);
      }
    });
  }

  openEditZoneDialog(zone: Zone): void {
    const dialogRef = this.dialog.open(ZoneFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        zone: { ...zone },
        title: 'Editar Zona',
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateZone(result);
      }
    });
  }

  createZone(zone: Zone): void {
    this.loading = true;
    
    this.zoneService.createZone(zone)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdZone: Zone) => {
          this.zones.push(createdZone);
          this.zoneLocationsCache.set(createdZone.id, []);
          
          this.uiService.showSnackbar({
            message: 'Zona creada exitosamente',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error creating zone:', error);
          this.uiService.showSnackbar({
            message: 'Error creando zona',
            type: 'error'
          });
        }
      });
  }

  updateZone(zone: Zone): void {
    // Since backend doesn't have update endpoint, we'll simulate local update
    this.loading = true;
    
    setTimeout(() => {
      const index = this.zones.findIndex(z => z.id === zone.id);
      if (index !== -1) {
        this.zones[index] = zone;
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Zona actualizada exitosamente',
        type: 'success'
      });
    }, 1000);
  }

  deleteZone(zone: Zone): void {
    const locationsInZone = this.getLocationCountForZone(zone.id);
    
    if (locationsInZone > 0) {
      this.uiService.showSnackbar({
        message: `No se puede eliminar la zona con ${locationsInZone} ubicaciones. Elimine todas las ubicaciones primero.`,
        type: 'error'
      });
      return;
    }

    this.dialogService.confirm({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar la zona ${zone.name}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.performDeleteZone(zone);
      }
    });
  }

  private performDeleteZone(zone: Zone): void {
    // Since backend doesn't have delete endpoint, we'll simulate removal locally
    this.loading = true;
    
    setTimeout(() => {
      const index = this.zones.findIndex(z => z.id === zone.id);
      if (index !== -1) {
        this.zones.splice(index, 1);
        this.zoneLocationsCache.delete(zone.id);
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Zona eliminada exitosamente',
        type: 'success'
      });
    }, 1000);
  }

  // Location operations
  openAddLocationDialog(zone: Zone): void {
    const dialogRef = this.dialog.open(LocationFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        location: new Location(0, zone.id, '', '', '', 0.0, 0.0, 'ACTIVE'),
        title: `Agregar Ubicación a ${zone.name}`,
        isEdit: false,
        zone: zone
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createLocation(result);
      }
    });
  }

  openEditLocationDialog(location: Location): void {
    const zone = this.zones.find(z => z.id === location.zoneId);
    
    const dialogRef = this.dialog.open(LocationFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        location: { ...location },
        title: `Editar Ubicación en ${zone?.name || 'Zona'}`,
        isEdit: true,
        zone: zone
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateLocation(result);
      }
    });
  }

  createLocation(location: Location): void {
    this.loading = true;
    
    this.locationService.addLocationToZone(location.zoneId, location)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdLocation: Location) => {
          // Update cache
          const zoneLocations = this.zoneLocationsCache.get(location.zoneId) || [];
          zoneLocations.push(createdLocation);
          this.zoneLocationsCache.set(location.zoneId, zoneLocations);
          
          this.uiService.showSnackbar({
            message: 'Ubicación creada exitosamente',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error creating location:', error);
          this.uiService.showSnackbar({
            message: 'Error creando ubicación',
            type: 'error'
          });
        }
      });
  }

  updateLocation(location: Location): void {
    this.loading = true;
    
    this.locationService.updateLocationStatus(location.id, location.status)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedLocation: Location) => {
          // Update in cache
          const zoneLocations = this.zoneLocationsCache.get(location.zoneId) || [];
          const cacheIndex = zoneLocations.findIndex(l => l.id === updatedLocation.id);
          if (cacheIndex !== -1) {
            zoneLocations[cacheIndex] = updatedLocation;
          }
          
          this.uiService.showSnackbar({
            message: 'Ubicación actualizada exitosamente',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error updating location:', error);
          this.uiService.showSnackbar({
            message: 'Error actualizando ubicación',
            type: 'error'
          });
        }
      });
  }

  toggleLocationStatus(location: Location): void {
    const newStatus = location.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const actionKey = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';
    
    this.dialogService.confirm({
      title: `${actionKey.charAt(0).toUpperCase() + actionKey.slice(1)} Ubicación`,
      message: `¿Está seguro que desea ${actionKey} esta ubicación?`,
      confirmText: actionKey.charAt(0).toUpperCase() + actionKey.slice(1),
      cancelText: 'Cancelar'
    }).subscribe(confirmed => {
      if (confirmed) {
        const updatedLocation = new Location(
          location.id,
          location.zoneId,
          location.address,
          location.city,
          location.country,
          location.latitude,
          location.longitude,
          newStatus
        );
        this.updateLocation(updatedLocation);
      }
    });
  }

  refreshData(): void {
    this.loadZonesWithLocations();
  }
}

