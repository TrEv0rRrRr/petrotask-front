import { Activity } from '../model/activity.entity';
import { ActivityResource, CreateActivityResource } from '../model/activity.resource';

export class ActivityAssembler {
  
  /**
   * Converts an ActivityResource (from API) to an Activity entity
   */
  static toEntityFromResource(resource: ActivityResource): Activity {
    return new Activity(
      resource.id,
      resource.activityCode,
      resource.description,
      new Date(resource.expectedTime),
      resource.weekNumber,
      resource.activityStatus,
      resource.zoneOrigin,
      resource.locationOrigin,
      resource.zoneDestination,
      resource.locationDestination
    );
  }

  /**
   * Converts an Activity entity to an ActivityResource (for API)
   */
  static toResourceFromEntity(entity: Activity): ActivityResource {
    return {
      id: entity.id,
      activityCode: entity.activityCode,
      description: entity.description,
      expectedTime: entity.expectedTime.toISOString(),
      weekNumber: entity.weekNumber,
      activityStatus: entity.activityStatus,
      zoneOrigin: entity.zoneOrigin,
      locationOrigin: entity.locationOrigin,
      zoneDestination: entity.zoneDestination,
      locationDestination: entity.locationDestination
    };
  }

  /**
   * Converts an Activity entity to a CreateActivityResource (for API)
   */
  static toCreateResourceFromEntity(entity: Activity): CreateActivityResource {
    return {
      activityCode: entity.activityCode,
      description: entity.description,
      expectedTime: entity.expectedTime.toISOString(),
      weekNumber: entity.weekNumber,
      activityStatus: entity.activityStatus,
      zoneOrigin: entity.zoneOrigin,
      locationOrigin: entity.locationOrigin,
      zoneDestination: entity.zoneDestination,
      locationDestination: entity.locationDestination
    };
  }
}
