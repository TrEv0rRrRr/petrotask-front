import { TaskProgramming } from '../model/task-programming.entity';
import { TaskProgrammingResource, CreateTaskProgrammingResource } from '../model/task-programming.resource';

export class TaskProgrammingAssembler {
  
  /**
   * Converts a TaskProgrammingResource (from API) to a TaskProgramming entity
   */
  static toEntityFromResource(resource: TaskProgrammingResource): TaskProgramming {
    return new TaskProgramming(
      resource.taskProgrammingId,
      resource.reservationId,
      resource.programmingStatus
    );
  }

  /**
   * Converts a TaskProgramming entity to a TaskProgrammingResource (for API)
   */
  static toResourceFromEntity(entity: TaskProgramming): TaskProgrammingResource {
    return {
      taskProgrammingId: entity.taskProgrammingId,
      reservationId: entity.reservationId,
      programmingStatus: entity.programmingStatus
    };
  }

  /**
   * Converts a TaskProgramming entity to a CreateTaskProgrammingResource (for API)
   */
  static toCreateResourceFromEntity(entity: TaskProgramming): CreateTaskProgrammingResource {
    if (!entity.taskId || !entity.resourceType || !entity.resourceId || !entity.start || !entity.end) {
      throw new Error('TaskId, resourceType, resourceId, start, and end are required for creating a task programming');
    }
    
    return {
      taskId: entity.taskId,
      resourceType: entity.resourceType,
      resourceId: entity.resourceId,
      programmingStatus: entity.programmingStatus,
      start: entity.start.toISOString(),
      end: entity.end.toISOString()
    };
  }
}
