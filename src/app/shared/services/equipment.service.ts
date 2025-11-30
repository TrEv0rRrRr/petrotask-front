import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseService} from './base.service';
import {Equipment} from '../../features/resources/models/equipment.entity';
import {Observable} from 'rxjs';

/**
 * API endpoint path for courses obtained from environment configuration.
 */

const equipmentEndPoint = environment.equipmentEndPoint;

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService<Equipment>{

  constructor() {
    super();
    this.resourceEndpoint = equipmentEndPoint;
  }

  // Método para obtener todos los equipos
  getAllEquipments(): Observable<Equipment[]> {
    return this.getAll();  // Usando el método heredado de BaseService
  }

  getEquipmentById(id: number): Observable<Equipment> {
    return this.getById(id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.create(equipment);
  }
}
