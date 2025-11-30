import { Location } from '../models/location.entity';
import { LocationResource, CreateLocationResource } from '../models/zone.resource';

export class LocationAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: LocationResource): Location {
    return new Location(
      resource.id,
      resource.zoneId,
      resource.street,
      resource.city,
      resource.country,
      resource.latitude,
      resource.longitude,
      resource.status
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Location): CreateLocationResource {
    return {
      street: entity.street,
      city: entity.city,
      country: entity.country,
      latitude: entity.latitude,
      longitude: entity.longitude,
      status: entity.status
    };
  }
}
