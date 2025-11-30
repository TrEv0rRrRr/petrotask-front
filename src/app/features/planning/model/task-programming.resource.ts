// Task Programming resources that match backend DTOs for API communication

export interface TaskProgrammingResource {
  taskProgrammingId: number;
  reservationId: number;
  programmingStatus: string;
}

export interface CreateTaskProgrammingResource {
  taskId: number;
  resourceType: string;
  resourceId: number;
  programmingStatus: string;
  start: string; // ISO date string for API
  end: string; // ISO date string for API
}

export interface UpdateTaskProgrammingStatusResource {
  programmingStatus: string;
}

export interface UpdateTaskProgrammingTimeIntervalResource {
  start: string; // ISO date string for API
  end: string; // ISO date string for API
} 