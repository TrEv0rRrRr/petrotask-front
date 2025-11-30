import { Zone } from '../models/zone.entity';
import { ZoneResource, CreateZoneResource } from '../models/zone.resource';

export class ZoneAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: ZoneResource): Zone {
    return new Zone(
      resource.zoneId,
      resource.tenantId,
      resource.name,
      []
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Zone): CreateZoneResource {
    return {
      name: entity.name
    };
  }
}