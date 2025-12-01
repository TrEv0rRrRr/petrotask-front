export class Equipment {
  id: number;
  tenantId: number;
  name: string;
  status: string;
  code: string;
  plate: string;
  capacityLoad: number;
  capacityPax: number;
  // Aliases para compatibilidad con templates
  type: string;
  plateNumber: string;
  capacityPassengers: number;

  constructor(equipment: {
    id?: number;
    tenantId?: number;
    name?: string;
    status?: string;
    code?: string;
    plate?: string;
    capacityLoad?: number;
    capacityPax?: number;
    type?: string;
    plateNumber?: string;
    capacityPassengers?: number;
  }) {
    this.id = equipment.id || 0;
    this.tenantId = equipment.tenantId || 0;
    this.name = equipment.name || '';
    this.status = equipment.status || '';
    this.code = equipment.code || '';
    this.plate = equipment.plate || '';
    this.capacityLoad = equipment.capacityLoad || 0;
    this.capacityPax = equipment.capacityPax || 0;
    // Aliases
    this.type = equipment.type || equipment.code || '';
    this.plateNumber = equipment.plateNumber || equipment.plate || '';
    this.capacityPassengers =
      equipment.capacityPassengers || equipment.capacityPax || 0;
  }
}
