import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReservationAssembler } from '../mappers/reservation.assembler';
import { Reservation } from '../models/reservation.entity';
import { ReservationResource } from '../models/reservation.resource';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = `${environment.apiBaseUrl}/reservations`;

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<ReservationResource[]>(this.baseUrl).pipe(
      map(resources => resources.map(resource => ReservationAssembler.toEntityFromResource(resource)))
    );
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<ReservationResource>(`${this.baseUrl}/${id}`).pipe(
      map(resource => ReservationAssembler.toEntityFromResource(resource))
    );
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    const createResource = ReservationAssembler.toResourceFromEntity(reservation);
    return this.http.post<ReservationResource>(this.baseUrl, createResource).pipe(
      map(resource => ReservationAssembler.toEntityFromResource(resource))
    );
  }

  // Get reservations by resource type and id
  getReservationsByResource(resourceType: string, resourceId: number): Observable<Reservation[]> {
    return this.http.get<ReservationResource[]>(`${this.baseUrl}/resource/${resourceType}/${resourceId}`).pipe(
      map(resources => resources.map(resource => ReservationAssembler.toEntityFromResource(resource)))
    );
  }

  // Get reservations by date range
  getReservationsByDateRange(startDate: string, endDate: string): Observable<Reservation[]> {
    return this.http.get<ReservationResource[]>(`${this.baseUrl}/date-range?start=${startDate}&end=${endDate}`).pipe(
      map(resources => resources.map(resource => ReservationAssembler.toEntityFromResource(resource)))
    );
  }
} 