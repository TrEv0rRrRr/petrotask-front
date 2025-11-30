import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskAssembler } from '../mappers/task.assembler';
import { Task } from '../model/task.entity';
import {
  CreateTaskResource,
  TaskResource,
  UpdateEmployeeIdResource,
  UpdateTaskDescriptionResource,
  UpdateTaskStatusResource,
} from '../model/task.resource';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new task
   */
  createTask(task: Task): Observable<Task> {
    const createResource = TaskAssembler.toCreateResourceFromEntity(task);
    return this.http.post<TaskResource>(this.baseUrl, createResource).pipe(
      map((resource) => TaskAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error('Error creating task:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get task by ID
   */
  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<TaskResource>(`${this.baseUrl}/${taskId}`).pipe(
      map((resource) => TaskAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error(`Error getting task ${taskId}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all tasks for a specific activity
   */
  getTasksByActivityId(activityId: number): Observable<Task[]> {
    return this.http
      .get<TaskResource[]>(`${this.baseUrl}/activities/${activityId}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            TaskAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          console.error(
            `Error getting tasks for activity ${activityId}:`,
            error
          );
          return of([]);
        })
      );
  }

  /**
   * Update task employee ID
   */
  updateTaskEmployeeId(taskId: number, employeeId: number): Observable<Task> {
    const updateResource: UpdateEmployeeIdResource = { employeeId };
    return this.http
      .patch<TaskResource>(
        `${this.baseUrl}/${taskId}/employeeId`,
        updateResource
      )
      .pipe(
        map((resource) => TaskAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating task ${taskId} employee:`, error);
          throw error;
        })
      );
  }

  /**
   * Update task description
   */
  updateTaskDescription(taskId: number, description: string): Observable<Task> {
    const updateResource: UpdateTaskDescriptionResource = { description };
    return this.http
      .patch<TaskResource>(
        `${this.baseUrl}/${taskId}/description`,
        updateResource
      )
      .pipe(
        map((resource) => TaskAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating task ${taskId} description:`, error);
          throw error;
        })
      );
  }

  /**
   * Update task status
   */
  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    const updateResource: UpdateTaskStatusResource = { status };
    return this.http
      .patch<TaskResource>(`${this.baseUrl}/${taskId}/status`, updateResource)
      .pipe(
        map((resource) => TaskAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating task ${taskId} status:`, error);
          throw error;
        })
      );
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<TaskResource[]>(this.baseUrl).pipe(
      map((resources) =>
        resources.map((resource) =>
          TaskAssembler.toEntityFromResource(resource)
        )
      ),
      catchError((error) => {
        console.error('Error getting all tasks:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http
      .get<TaskResource[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            TaskAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          console.error(`Error getting tasks by status ${status}:`, error);
          return throwError(() => error);
        })
      );
  }
}
