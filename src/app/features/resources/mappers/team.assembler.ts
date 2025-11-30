import { Team } from '../models/team.entity';
import { TeamResource, CreateTeamResource } from '../models/team.resource';

export class TeamAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: TeamResource): Team {
    return new Team(
      resource.teamId,
      resource.tenantId,
      resource.name,
      []
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Team): CreateTeamResource {
    return {
      name: entity.name
    };
  }
}
