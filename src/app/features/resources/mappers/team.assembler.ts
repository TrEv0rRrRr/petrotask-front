import { Team } from '../models/team.entity';
import { CreateTeamResource, TeamResource } from '../models/team.resource';
import { TeamMemberAssembler } from './team-member.assembler';

export class TeamAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: TeamResource): Team {
    const members = (resource.members || []).map((memberResource) =>
      TeamMemberAssembler.toEntityFromResource(memberResource)
    );

    return new Team(resource.teamId, resource.tenantId, resource.name, members);
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Team): CreateTeamResource {
    return {
      name: entity.name,
    };
  }
}
