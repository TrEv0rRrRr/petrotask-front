import { TeamMember } from "./team-member.entity";

export class Team {
    id: number;
    tenantId: number;
    name: string;
    members: TeamMember[];
    
    constructor(
        id: number,
        tenantId: number,
        name: string,
        members: TeamMember[] = []
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.name = name;
        this.members = members;
    }
}
