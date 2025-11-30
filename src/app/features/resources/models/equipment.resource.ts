// Resource models for backend communication
export interface EquipmentResource {
  equipmentId: number;
  tenantId: number;
  name: string;
  status: string;
  code: string;
  plate: string;
  capacityLoad: number;
  capacityPax: number;
}

export interface CreateEquipmentResource {
  name: string;
  status: string;
  code: string;
  plate: string;
  capacityLoad: number;
  capacityPax: number;
}

export interface UpdateEquipmentStatusResource {
  status: string;
} 