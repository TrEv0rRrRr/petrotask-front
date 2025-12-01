import { Task } from './task.entity';

export type ActivityStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export class Activity {
  id: number;
  activityCode: string;
  description: string;
  expectedTime: Date;
  weekNumber: number;
  activityStatus: ActivityStatus;
  zoneOrigin: number;
  locationOrigin: number;
  zoneDestination: number;
  locationDestination: number;
  tasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: number = 0,
    activityCode: string = '',
    description: string = '',
    expectedTime: Date = new Date(),
    weekNumber: number = 1,
    activityStatus: ActivityStatus = 'PLANNED',
    zoneOrigin: number = 0,
    locationOrigin: number = 0,
    zoneDestination: number = 0,
    locationDestination: number = 0
  ) {
    this.id = id;
    this.activityCode = activityCode;
    this.description = description;
    this.expectedTime = expectedTime;
    this.weekNumber = weekNumber;
    this.activityStatus = activityStatus;
    this.zoneOrigin = zoneOrigin;
    this.locationOrigin = locationOrigin;
    this.zoneDestination = zoneDestination;
    this.locationDestination = locationDestination;
    this.tasks = [];
  }
}
