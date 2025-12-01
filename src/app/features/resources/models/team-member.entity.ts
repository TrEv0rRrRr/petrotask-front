export interface Employee {
  id: number;
  fullName: string;
}

export interface Position {
  id: number;
  name: string;
}

export class TeamMember {
  id: number;
  teamId: number;
  employeeId: number;
  employee?: Employee;
  position?: Position;

  constructor(
    id: number,
    teamId: number,
    employeeId: number,
    employee?: Employee,
    position?: Position
  ) {
    this.id = id;
    this.teamId = teamId;
    this.employeeId = employeeId;
    this.employee = employee;
    this.position = position;
  }
}
