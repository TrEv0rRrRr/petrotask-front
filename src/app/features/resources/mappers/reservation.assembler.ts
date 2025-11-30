import { Reservation } from '../models/reservation.entity';
import { ReservationResource, CreateReservationResource } from '../models/reservation.resource';

export class ReservationAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: ReservationResource): Reservation {
    return new Reservation(
      resource.reservationId,
      resource.tenantId,
      resource.resourceType,
      resource.resourceId,
      new Date(resource.start),
      new Date(resource.end)
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Reservation): CreateReservationResource {
    return {
      resourceType: entity.resourceType,
      resourceId: entity.resourceId,
      start: entity.start.toISOString(),
      end: entity.end.toISOString()
    };
  }
} 