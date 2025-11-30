import { Position } from '../models/position.entity';
import { PositionResource, CreatePositionResource } from '../models/position.resource';

export class PositionAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: PositionResource): Position {
    return new Position(
      resource.positionId,
      resource.tenantId,
      resource.title,
      resource.description
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Position): CreatePositionResource {
    return {
      title: entity.title,
      description: entity.description
    };
  }
}
