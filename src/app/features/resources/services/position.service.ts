import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PositionAssembler } from '../mappers/position.assembler';
import { Position } from '../models/position.entity';
import {
  CreatePositionResource,
  PositionResource,
} from '../models/position.resource';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private baseUrl = `${environment.apiBaseUrl}/positions`;

  constructor(private http: HttpClient) {}

  getAllPositions(): Observable<Position[]> {
    return this.http.get<PositionResource[]>(this.baseUrl).pipe(
      map((resources) =>
        resources.map((resource) =>
          PositionAssembler.toEntityFromResource(resource)
        )
      ),
      catchError((error) => {
        console.error('Error in getAllPositions:', error);
        return throwError(() => error);
      })
    );
  }

  getPositionById(id: number): Observable<Position> {
    return this.http.get<PositionResource>(`${this.baseUrl}/${id}`).pipe(
      map((resource) => PositionAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error(`Error getting position ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  createPosition(position: Position): Observable<Position> {
    const createResource = PositionAssembler.toResourceFromEntity(position);
    return this.http.post<PositionResource>(this.baseUrl, createResource).pipe(
      map((resource) => PositionAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error('Error creating position:', error);
        return throwError(() => error);
      })
    );
  }
}
