// Task resources that match backend DTOs for API communication

export interface TaskResource {
  taskId: number;
  description: string;
  status: string;
  title: string;
  employeeId: number;
}

export interface CreateTaskResource {
  activityId: number;
  description: string;
  status: string;
  title: string;
  employeeId: number;
}

export interface UpdateTaskStatusResource {
  status: string;
}

export interface UpdateTaskDescriptionResource {
  description: string;
}

export interface UpdateEmployeeIdResource {
  employeeId: number;
} 