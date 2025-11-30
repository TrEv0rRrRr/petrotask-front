import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EquipmentAssembler } from '../mappers/equipment.assembler';
import { Equipment } from '../models/equipment.entity';
import {
  EquipmentResource,
  UpdateEquipmentStatusResource,
} from '../models/equipment.resource';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = `${environment.apiBaseUrl}/equipment`;

  constructor(private http: HttpClient) {}

  getAllEquipment(): Observable<Equipment[]> {
    return this.http
      .get<EquipmentResource[]>(this.baseUrl)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            EquipmentAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  getEquipmentById(id: number): Observable<Equipment> {
    return this.http
      .get<EquipmentResource>(`${this.baseUrl}/${id}`)
      .pipe(
        map((resource) => EquipmentAssembler.toEntityFromResource(resource))
      );
  }

  createEquipment(equipment: Equipment): Observable<Equipment> {
    const createResource = EquipmentAssembler.toResourceFromEntity(equipment);
    return this.http
      .post<EquipmentResource>(this.baseUrl, createResource)
      .pipe(
        map((resource) => EquipmentAssembler.toEntityFromResource(resource))
      );
  }

  updateEquipmentStatus(id: number, status: string): Observable<Equipment> {
    const updateResource: UpdateEquipmentStatusResource = { status };
    return this.http
      .patch<EquipmentResource>(`${this.baseUrl}/${id}/status`, updateResource)
      .pipe(
        map((resource) => EquipmentAssembler.toEntityFromResource(resource))
      );
  }

  getEquipmentsByStatus(status: string): Observable<Equipment[]> {
    return this.http
      .get<EquipmentResource[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            EquipmentAssembler.toEntityFromResource(resource)
          )
        )
      );
  }
}
