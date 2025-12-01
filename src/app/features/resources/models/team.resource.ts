// Resource models for backend communication
export interface TeamResource {
  teamId: number;
  tenantId: number;
  name: string;
  members?: TeamMemberResource[];
}

export interface CreateTeamResource {
  name: string;
}

export interface UpdateTeamResource {
  name: string;
}

export interface TeamMemberResource {
  id: number;
  teamId: number;
  employeeId: number;
}

export interface CreateTeamMemberResource {
  employeeId: number;
}
