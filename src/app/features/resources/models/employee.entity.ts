import { Position } from "./position.entity";

export class Employee {
  id: number;
  tenantId: number;
  name: string;
  lastName: string;
  positionId: number;
  positionTitle: string;
  status: string;
  email: string;
  phoneNumber: string;

  constructor(
    id?: number,
    tenantId?: number,
    name?: string,
    lastName?: string,
    positionId?: number,
    positionTitle?: string,
    status: string = 'ACTIVE',
    email?: string,
    phoneNumber?: string
  ) {
    this.id = id || 0;
    this.tenantId = tenantId || 0;
    this.name = name || '';
    this.lastName = lastName || '';
    this.positionId = positionId || 0;
    this.positionTitle = positionTitle || '';
    this.status = status || 'ACTIVE';
    this.email = email || '';
    this.phoneNumber = phoneNumber || '';
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }
}
