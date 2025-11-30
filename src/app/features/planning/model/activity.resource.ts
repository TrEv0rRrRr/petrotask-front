// Activity resources that match backend DTOs for API communication

export interface ActivityResource {
  id: number;
  activityCode: string;
  description: string;
  expectedTime: string; // ISO date string for API
  weekNumber: number;
  activityStatus: string;
  zoneOrigin: number;
  locationOrigin: number;
  zoneDestination: number;
  locationDestination: number;
}

export interface CreateActivityResource {
  activityCode: string;
  description: string;
  expectedTime: string; // ISO date string for API
  weekNumber: number;
  activityStatus: string;
  zoneOrigin: number;
  locationOrigin: number;
  zoneDestination: number;
  locationDestination: number;
}

export interface UpdateActivityStatusResource {
  status: string;
} 