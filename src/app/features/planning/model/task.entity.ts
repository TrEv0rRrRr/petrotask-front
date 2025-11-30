export class Task {
  taskId: number;
  title: string;
  description: string;
  status: string;
  employeeId: number;
  activityId?: number; // Keep for frontend logic

  constructor(
    taskId: number = 0,
    title: string = '',
    description: string = '',
    status: string = 'PENDING',
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
