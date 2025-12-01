import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LocationAssembler } from '../mappers/location.assembler';
import { ZoneAssembler } from '../mappers/zone.assembler';
import { Location } from '../models/location.entity';
import { Zone } from '../models/zone.entity';
import {
  CreateLocationResource,
  CreateZoneResource,
  LocationResource,
  UpdateLocationResource,
  UpdateLocationStatusResource,
  UpdateZoneResource,
  ZoneResource,
} from '../models/zone.resource';

/**
 * Interface for Zone with its locations
 */
export interface ZoneWithLocations {
  zone: Zone;
  locations: Location[];
}

@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private baseUrl = `${environment.apiBaseUrl}/zones`;

  constructor(private http: HttpClient) {}

  // Zone operations
  getAllZones(): Observable<Zone[]> {
    return this.http.get<ZoneResource[]>(this.baseUrl).pipe(
      map((resources) =>
        resources.map((resource) =>
          ZoneAssembler.toEntityFromResource(resource)
        )
      ),
      catchError((error) => {
        if (error.status === 404) {
          console.log('No zones found (empty database)');
          return of([]);
        }
        console.error('Error in getAllZones:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all zones with their locations included
   * This is more efficient than loading zones and locations separately
   */
  getZonesWithLocations(): Observable<ZoneWithLocations[]> {
    return forkJoin({
      zones: this.getAllZones(),
      allLocations: this.getAllLocations(),
    }).pipe(
      map(({ zones, allLocations }) => {
        return zones.map((zone) => ({
          zone,
          locations: allLocations.filter(
            (location) => location.zoneId === zone.id
          ),
        }));
      }),
      catchError((error) => {
        console.error('Error in getZonesWithLocations:', error);
        return throwError(() => error);
      })
    );
  }

  getZoneById(id: number): Observable<Zone> {
    return this.http.get<ZoneResource>(`${this.baseUrl}/${id}`).pipe(
      map((resource) => ZoneAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error(`Error getting zone ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a zone with its locations included
   */
  getZoneWithLocations(zoneId: number): Observable<ZoneWithLocations> {
    return forkJoin({
      zone: this.getZoneById(zoneId),
      locations: this.getLocationsByZoneId(zoneId),
    }).pipe(
      map(({ zone, locations }) => ({
        zone,
        locations,
      })),
      catchError((error) => {
        console.error(`Error getting zone ${zoneId} with locations:`, error);
        return throwError(() => error);
      })
    );
  }

  createZone(zone: Zone): Observable<Zone> {
    const createResource = ZoneAssembler.toResourceFromEntity(zone);
    return this.http.post<ZoneResource>(this.baseUrl, createResource).pipe(
      map((resource) => ZoneAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error('Error creating zone:', error);
        const newZone = new Zone(Date.now(), zone.tenantId, zone.name);
        return of(newZone);
      })
    );
  }

  updateZone(id: number, zone: Zone): Observable<Zone> {
    const updateResource: UpdateZoneResource = {
      name: zone.name,
    };
    return this.http
      .put<ZoneResource>(`${this.baseUrl}/${id}`, updateResource)
      .pipe(
        map((resource) => ZoneAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating zone ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  deleteZone(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting zone ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Location operations
  getAllLocations(): Observable<Location[]> {
    // Backend has endpoint at /zones/zones/locations (typo in backend)
    return this.http
      .get<LocationResource[]>(`${this.baseUrl}/zones/locations`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            LocationAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          if (error.status === 404) {
            console.log('No locations found (empty database)');
            return of([]);
          }
          console.error('Error in getAllLocations:', error);
          return throwError(() => error);
        })
      );
  }

  getLocationById(id: number): Observable<Location> {
    return this.http
      .get<LocationResource>(`${this.baseUrl}/locations/${id}`)
      .pipe(
        map((resource) => LocationAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error getting location ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  getLocationsByZoneId(zoneId: number): Observable<Location[]> {
    // Backend has endpoint at /zones/zones/{zoneId} (typo in backend)
    return this.http
      .get<LocationResource[]>(`${this.baseUrl}/zones/${zoneId}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            LocationAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          if (error.status === 404) {
            console.log(`No locations found for zone ${zoneId} (empty)`);
            return of([]);
          }
          console.error(`Error getting locations for zone ${zoneId}:`, error);
          return throwError(() => error);
        })
      );
  }

  addLocationToZone(zoneId: number, location: Location): Observable<Location> {
    const createResource = LocationAssembler.toResourceFromEntity(location);
    return this.http
      .post<LocationResource>(
        `${this.baseUrl}/${zoneId}/locations`,
        createResource
      )
      .pipe(
        map((resource) => LocationAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error('Error adding location to zone:', error);
          return throwError(() => error);
        })
      );
  }

  updateLocationStatus(id: number, status: string): Observable<Location> {
    const updateResource: UpdateLocationStatusResource = { status };
    return this.http
      .patch<LocationResource>(`${this.baseUrl}/${id}/status`, updateResource)
      .pipe(
        map((resource) => LocationAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error('Error updating location status:', error);
          return throwError(() => error);
        })
      );
  }

  getLocationsByStatus(status: string): Observable<Location[]> {
    return this.http
      .get<LocationResource[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            LocationAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          console.error(`Error getting locations by status ${status}:`, error);
          return throwError(() => error);
        })
      );
  }

  updateLocation(id: number, location: Location): Observable<Location> {
    const updateResource: UpdateLocationResource = {
      street: location.street,
      city: location.city,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      status: location.status,
    };
    return this.http
      .put<LocationResource>(`${this.baseUrl}/locations/${id}`, updateResource)
      .pipe(
        map((resource) => LocationAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating location ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locations/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting location ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
