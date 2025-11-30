export class TaskProgramming {
  taskProgrammingId: number;
  reservationId: number;
  programmingStatus: string;
  taskId?: number; // Keep for frontend logic
  resourceType?: string; // Keep for frontend logic
  resourceId?: number; // Keep for frontend logic
  start?: Date; // Keep for frontend logic  
  end?: Date; // Keep for frontend logic

  constructor(
    taskProgrammingId: number = 0,
    reservationId: number = 0,
    programmingStatus: string = 'PENDING',
    taskId?: number,
    resourceType?: string,
    resourceId?: number,
    start?: Date,
    end?: Date
  ) {
    this.taskProgrammingId = taskProgrammingId;
    this.reservationId = reservationId;
    this.programmingStatus = programmingStatus;
    this.taskId = taskId;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.start = start;
    this.end = end;
  }
} 