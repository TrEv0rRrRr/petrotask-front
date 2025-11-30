import { TeamMember } from '../models/team-member.entity';
import { TeamMemberResource, CreateTeamMemberResource } from '../models/team.resource';

export class TeamMemberAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: TeamMemberResource): TeamMember {
    return new TeamMember(
      resource.id,
      resource.teamId,
      resource.employeeId
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: TeamMember): CreateTeamMemberResource {
    return {
      employeeId: entity.employeeId
    };
  }
}
