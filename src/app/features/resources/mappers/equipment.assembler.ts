import { Equipment } from '../models/equipment.entity';
import { EquipmentResource, CreateEquipmentResource } from '../models/equipment.resource';

export class EquipmentAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: EquipmentResource): Equipment {
    return new Equipment({
      id: resource.equipmentId,
      tenantId: resource.tenantId,
      name: resource.name,
      status: resource.status,
      code: resource.code,
      plate: resource.plate,
      capacityLoad: resource.capacityLoad,
      capacityPax: resource.capacityPax
    });
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Equipment): CreateEquipmentResource {
    return {
      name: entity.name,
      status: entity.status,
      code: entity.code,
      plate: entity.plate,
      capacityLoad: entity.capacityLoad,
      capacityPax: entity.capacityPax
    };
  }
}
