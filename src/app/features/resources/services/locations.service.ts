import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { Location } from '../models/location.entity';

const locationEndPoint = environment.locationEndPoint;

@Injectable({
  providedIn: 'root'
})
export class LocationsService extends BaseService<Location> {

  constructor() {
    super();
    this.resourceEndpoint = locationEndPoint;
  }

  getAllLocations(): Observable<Location[]> {
    return this.getAll();
  }

  getLocationById(id: number): Observable<Location | undefined> {
    return this.getById(id);
  }

  createLocation(location: Location): Observable<Location> {
    return this.create(location);
  }

  deleteLocation(id: number): Observable<boolean> {
    return this.delete(id);
  }
}
