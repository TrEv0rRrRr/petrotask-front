// Task resources that match backend DTOs for API communication
import { TaskStatus } from './task.entity';

export interface TaskResource {
  taskId: number;
  description: string;
  status: TaskStatus;
  title: string;
  employeeId: number;
}

export interface CreateTaskResource {
  activityId: number;
  description: string;
  status: string; // Backend expects string: "Pending", "InProgress", "Completed", "Cancelled"
  title: string;
  employeeId: number;
}

export interface UpdateTaskStatusResource {
  status: string; // Backend expects string
}

export interface UpdateTaskDescriptionResource {
  description: string;
}

export interface UpdateEmployeeIdResource {
  employeeId: number;
}

export interface UpdateTaskResource {
  title: string;
  description: string;
  status: string;
  employeeId: number;
}
