import { Employee } from '../models/employee.entity';
import {
  CreateEmployeeResource,
  EmployeeResource,
} from '../models/employee.resource';

export class EmployeeAssembler {
  // Convert from backend resource to frontend entity
  static toEntityFromResource(resource: EmployeeResource): Employee {
    return new Employee(
      resource.employeeId,
      resource.tenantId,
      resource.name,
      resource.lastName,
      resource.positionId,
      resource.positionTitle,
      resource.employeeStatus,
      resource.email,
      resource.phoneNumber
    );
  }

  // Convert from frontend entity to backend resource for creation
  static toResourceFromEntity(entity: Employee): CreateEmployeeResource {
    const resource = {
      name: entity.name,
      lastName: entity.lastName,
      positionId: entity.positionId,
      employeeStatus: entity.status,
      email: entity.email,
      phoneNumber: entity.phoneNumber,
    };
    console.log('Creating employee with data:', entity);
    console.log('Sending to backend:', resource);
    return resource;
  }
}
