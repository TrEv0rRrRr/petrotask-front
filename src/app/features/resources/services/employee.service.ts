import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmployeeAssembler } from '../mappers/employee.assembler';
import { Employee } from '../models/employee.entity';
import {
  EmployeeResource,
  UpdateEmployeeStatusResource,
} from '../models/employee.resource';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http
      .get<EmployeeResource[]>(this.baseUrl)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            EmployeeAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http
      .get<EmployeeResource>(`${this.baseUrl}/${id}`)
      .pipe(
        map((resource) => EmployeeAssembler.toEntityFromResource(resource))
      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    const createResource = EmployeeAssembler.toResourceFromEntity(employee);
    return this.http
      .post<EmployeeResource>(this.baseUrl, createResource)
      .pipe(
        map((resource) => EmployeeAssembler.toEntityFromResource(resource))
      );
  }

  updateEmployeeStatus(id: number, status: string): Observable<Employee> {
    const updateResource: UpdateEmployeeStatusResource = {
      employeeStatus: status,
    };
    return this.http
      .patch<EmployeeResource>(`${this.baseUrl}/${id}/status`, updateResource)
      .pipe(
        map((resource) => EmployeeAssembler.toEntityFromResource(resource))
      );
  }

  getEmployeesByStatus(status: string): Observable<Employee[]> {
    return this.http
      .get<EmployeeResource[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            EmployeeAssembler.toEntityFromResource(resource)
          )
        )
      );
  }
}
