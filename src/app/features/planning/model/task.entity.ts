export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export class Task {
  taskId: number;
  title: string;
  description: string;
  status: TaskStatus;
  employeeId: number;
  activityId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    taskId: number = 0,
    title: string = '',
    description: string = '',
    status: TaskStatus = 'PENDING',
    employeeId: number = 0,
    activityId?: number
  ) {
    this.taskId = taskId;
    this.title = title;
    this.description = description;
    this.status = status;
    this.employeeId = employeeId;
    this.activityId = activityId;
  }
}
