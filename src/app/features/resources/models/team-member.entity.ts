export class TeamMember {
    id: number;
    teamId: number;
    employeeId: number;
    
    constructor(
        id: number,
        teamId: number,
        employeeId: number
    ) {
        this.id = id;
        this.teamId = teamId;
        this.employeeId = employeeId;
    }
}
