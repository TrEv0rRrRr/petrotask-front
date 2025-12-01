import { TeamMember } from './team-member.entity';
import { Zone } from './zone.entity';

export class Team {
  id: number;
  tenantId: number;
  name: string;
  members: TeamMember[];
  status?: string;
  zone?: Zone;
  date?: string;

  constructor(
    id: number,
    tenantId: number,
    name: string,
    members: TeamMember[] = [],
    status?: string,
    zone?: Zone,
    date?: string
  ) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.members = members;
    this.status = status;
    this.zone = zone;
    this.date = date;
  }
}
