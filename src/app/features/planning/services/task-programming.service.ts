import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskProgrammingAssembler } from '../mappers/task-programming.assembler';
import { TaskProgramming } from '../model/task-programming.entity';
import {
  TaskProgrammingResource,
  UpdateTaskProgrammingStatusResource,
  UpdateTaskProgrammingTimeIntervalResource,
} from '../model/task-programming.resource';

@Injectable({
  providedIn: 'root',
})
export class TaskProgrammingService {
  private baseUrl = `${environment.apiBaseUrl}/task-programming`;

  constructor(private http: HttpClient) {}

  /**
   * Add programming to a task
   */
  addTaskProgramming(
    taskProgramming: TaskProgramming
  ): Observable<TaskProgramming> {
    const createResource =
      TaskProgrammingAssembler.toCreateResourceFromEntity(taskProgramming);
    return this.http
      .post<TaskProgrammingResource>(this.baseUrl, createResource)
      .pipe(
        map((resource) =>
          TaskProgrammingAssembler.toEntityFromResource(resource)
        ),
        catchError((error) => {
          console.error('Error creating task programming:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get task programming by ID
   */
  getTaskProgrammingById(programmingId: number): Observable<TaskProgramming> {
    return this.http
      .get<TaskProgrammingResource>(`${this.baseUrl}/${programmingId}`)
      .pipe(
        map((resource) =>
          TaskProgrammingAssembler.toEntityFromResource(resource)
        ),
        catchError((error) => {
          console.error(
            `Error getting task programming ${programmingId}:`,
            error
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Get task programmings by task ID
   */
  getTaskProgrammingsByTaskId(taskId: number): Observable<TaskProgramming[]> {
    return this.http
      .get<TaskProgrammingResource[]>(`${this.baseUrl}/tasks/${taskId}`)
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            TaskProgrammingAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          console.error(
            `Error getting task programmings for task ${taskId}:`,
            error
          );
          return of([]);
        })
      );
  }

  /**
   * Update task programming time interval
   */
  updateTaskProgrammingTimeInterval(
    taskProgrammingId: number,
    start: Date,
    end: Date
  ): Observable<TaskProgramming> {
    const updateResource: UpdateTaskProgrammingTimeIntervalResource = {
      start: start.toISOString(),
      end: end.toISOString(),
    };
    return this.http
      .patch<TaskProgrammingResource>(
        `${this.baseUrl}/${taskProgrammingId}/time-interval`,
        updateResource
      )
      .pipe(
        map((resource) =>
          TaskProgrammingAssembler.toEntityFromResource(resource)
        ),
        catchError((error) => {
          console.error(
            `Error updating task programming ${taskProgrammingId} time interval:`,
            error
          );
          throw error;
        })
      );
  }

  /**
   * Update task programming status
   */
  updateTaskProgrammingStatus(
    taskProgrammingId: number,
    status: string
  ): Observable<TaskProgramming> {
    const updateResource: UpdateTaskProgrammingStatusResource = {
      programmingStatus: status,
    };
    return this.http
      .patch<TaskProgrammingResource>(
        `${this.baseUrl}/${taskProgrammingId}/status`,
        updateResource
      )
      .pipe(
        map((resource) =>
          TaskProgrammingAssembler.toEntityFromResource(resource)
        ),
        catchError((error) => {
          console.error(
            `Error updating task programming ${taskProgrammingId} status:`,
            error
          );
          throw error;
        })
      );
  }

  /**
   * Get all task programmings
   */
  getAllTaskProgrammings(): Observable<TaskProgramming[]> {
    return this.http.get<TaskProgrammingResource[]>(this.baseUrl).pipe(
      map((resources) =>
        resources.map((resource) =>
          TaskProgrammingAssembler.toEntityFromResource(resource)
        )
      ),
      catchError((error) => {
        console.error('Error getting all task programmings:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get task programmings by activity ID
   */
  getTaskProgrammingsByActivityId(
    activityId: number
  ): Observable<TaskProgramming[]> {
    return this.http
      .get<TaskProgrammingResource[]>(
        `${this.baseUrl}/activities/${activityId}`
      )
      .pipe(
        map((resources) =>
          resources.map((resource) =>
            TaskProgrammingAssembler.toEntityFromResource(resource)
          )
        ),
        catchError((error) => {
          console.error(
            `Error getting task programmings for activity ${activityId}:`,
            error
          );
          return throwError(() => error);
        })
      );
  }
}
