import { Task } from '../model/task.entity';
import { TaskResource, CreateTaskResource } from '../model/task.resource';

export class TaskAssembler {
  
  /**
   * Converts a TaskResource (from API) to a Task entity
   */
  static toEntityFromResource(resource: TaskResource): Task {
    return new Task(
      resource.taskId,
      resource.title,
      resource.description,
      resource.status,
      resource.employeeId
    );
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
      employeeId: entity.employeeId
    };
  }

  /**
   * Converts a Task entity to a CreateTaskResource (for API)
   */
  static toCreateResourceFromEntity(entity: Task): CreateTaskResource {
    if (!entity.activityId) {
      throw new Error('ActivityId is required for creating a task');
    }
    
    return {
      activityId: entity.activityId,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      employeeId: entity.employeeId
    };
  }
}
