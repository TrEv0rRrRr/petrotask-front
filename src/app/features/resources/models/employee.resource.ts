// Resource models for backend communication
export interface EmployeeResource {
  tenantId: number;
  employeeId: number;
  name: string;
  lastName: string;
  positionId: number;
  positionTitle: string;
  employeeStatus: string;
  email: string;
  phoneNumber: string;
}

export interface CreateEmployeeResource {
  name: string;
  lastName: string;
  positionId: number;
  employeeStatus: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateEmployeeStatusResource {
  employeeStatus: string;
} 