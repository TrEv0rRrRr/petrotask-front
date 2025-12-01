import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivityAssembler } from '../mappers/activity.assembler';
import { Activity } from '../model/activity.entity';
import {
  ActivityResource,
  CreateActivityResource,
  UpdateActivityResource,
  UpdateActivityStatusResource,
} from '../model/activity.resource';
import { Task } from '../model/task.entity';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private baseUrl = `${environment.apiBaseUrl}/activities`;

  constructor(private http: HttpClient, private taskService: TaskService) {}

  /**
   * Create a new activity
   */
  createActivity(activity: Activity): Observable<Activity> {
    const createResource =
      ActivityAssembler.toCreateResourceFromEntity(activity);
    return this.http.post<ActivityResource>(this.baseUrl, createResource).pipe(
      map((resource) => ActivityAssembler.toEntityFromResource(resource)),
      catchError((error) => {
        console.error('Error creating activity:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get activity by ID
   */
  getActivityById(activityId: number): Observable<Activity> {
    return this.http
      .get<ActivityResource>(`${this.baseUrl}/${activityId}`)
      .pipe(
        switchMap((resource) => {
          const activity = ActivityAssembler.toEntityFromResource(resource);

          // Get tasks for this activity
          return this.taskService.getTasksByActivityId(activityId).pipe(
            map((tasks: Task[]) => {
              activity.tasks = tasks;
              return activity;
            }),
            catchError((error) => {
              console.error(
                `Error getting tasks for activity ${activityId}:`,
                error
              );
              // Return activity without tasks if task fetch fails
              return of(activity);
            })
          );
        }),
        catchError((error) => {
          console.error(`Error getting activity ${activityId}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get all activities
   */
  getAllActivities(): Observable<Activity[]> {
    return this.http.get<ActivityResource[]>(this.baseUrl).pipe(
      switchMap((resources) => {
        const activities = resources.map((resource) =>
          ActivityAssembler.toEntityFromResource(resource)
        );

        // Get all tasks and assign them to their respective activities
        return this.taskService.getAllTasks().pipe(
          map((tasks: Task[]) => {
            return activities.map((activity) => {
              activity.tasks = tasks.filter(
                (task) => task.activityId === activity.id
              );
              return activity;
            });
          })
        );
      }),
      catchError((error) => {
        console.error('Error getting all activities:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get activities by status
   */
  getActivitiesByStatus(status: string): Observable<Activity[]> {
    return this.http
      .get<ActivityResource[]>(`${this.baseUrl}/status/${status}`)
      .pipe(
        switchMap((resources) => {
          const activities = resources.map((resource) =>
            ActivityAssembler.toEntityFromResource(resource)
          );

          // Get all tasks and assign them to their respective activities
          return this.taskService.getAllTasks().pipe(
            map((tasks: Task[]) => {
              return activities.map((activity) => {
                activity.tasks = tasks.filter(
                  (task) => task.activityId === activity.id
                );
                return activity;
              });
            })
          );
        }),
        catchError((error) => {
          console.error(`Error getting activities by status ${status}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update activity status
   */
  updateActivityStatus(
    activityId: number,
    status: string
  ): Observable<Activity> {
    const updateResource: UpdateActivityStatusResource = { status };
    console.log('Updating activity status:', {
      activityId,
      status,
      updateResource,
    });
    return this.http
      .patch<ActivityResource>(
        `${this.baseUrl}/${activityId}/status`,
        updateResource
      )
      .pipe(
        map((resource) => {
          console.log('Activity status updated successfully:', resource);
          // WORKAROUND: Backend returns old status in response, but update was successful
          // Manually override the status with what we sent to reflect the actual state
          const updatedResource = { ...resource, activityStatus: status };
          return ActivityAssembler.toEntityFromResource(updatedResource);
        }),
        catchError((error) => {
          console.error(`Error updating activity ${activityId} status:`, error);
          console.error('Error details:', error.error);
          throw error;
        })
      );
  }

  /**
   * Update activity (full update)
   */
  updateActivity(activityId: number, activity: Activity): Observable<Activity> {
    const updateResource: UpdateActivityResource = {
      activityCode: activity.activityCode,
      description: activity.description,
      expectedTime: activity.expectedTime.toISOString(),
      weekNumber: activity.weekNumber,
      activityStatus: activity.activityStatus,
      zoneOrigin: activity.zoneOrigin,
      locationOrigin: activity.locationOrigin,
      zoneDestination: activity.zoneDestination,
      locationDestination: activity.locationDestination,
    };
    return this.http
      .put<ActivityResource>(`${this.baseUrl}/${activityId}`, updateResource)
      .pipe(
        map((resource) => ActivityAssembler.toEntityFromResource(resource)),
        catchError((error) => {
          console.error(`Error updating activity ${activityId}:`, error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete activity
   */
  deleteActivity(activityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${activityId}`).pipe(
      catchError((error) => {
        console.error(`Error deleting activity ${activityId}:`, error);
        return throwError(() => error);
      })
    );
  }
}
