import { Task, TaskStatus } from '../model/task.entity';
import { CreateTaskResource, TaskResource } from '../model/task.resource';

export class TaskAssembler {
  /**
   * Converts a TaskResource (from API) to a Task entity
   */
  static toEntityFromResource(resource: TaskResource): Task {
    const task = new Task(
      resource.taskId,
      resource.title,
      resource.description,
      resource.status,
      resource.employeeId
    );
    return task;
  }

  /**
   * Converts a Task entity to a TaskResource (for API)
   */
  static toResourceFromEntity(entity: Task): TaskResource {
    return {
      taskId: entity.taskId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      employeeId: entity.employeeId,
    };
  }

  /**
   * Converts a Task entity to a CreateTaskResource (for API)
   * Maps frontend TaskStatus enum to backend expected strings
   */
  static toCreateResourceFromEntity(entity: Task): CreateTaskResource {
    if (!entity.activityId) {
      throw new Error('ActivityId is required for creating a task');
    }

    return {
      activityId: entity.activityId,
      title: entity.title,
      description: entity.description,
      status: this.mapStatusToBackend(entity.status),
      employeeId: entity.employeeId,
    };
  }

  /**
   * Maps frontend TaskStatus to backend expected string format
   */
  static mapStatusToBackend(status: TaskStatus): string {
    const statusMap: Record<TaskStatus, string> = {
      PENDING: 'Pending',
      IN_PROGRESS: 'InProgress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return statusMap[status] || 'Pending';
  }

  /**
   * Maps backend status string to frontend TaskStatus
   */
  static mapStatusFromBackend(status: string): TaskStatus {
    const statusMap: Record<string, TaskStatus> = {
      PENDING: 'PENDING',
      IN_PROGRESS: 'IN_PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    };
    return statusMap[status] || 'PENDING';
  }
}
