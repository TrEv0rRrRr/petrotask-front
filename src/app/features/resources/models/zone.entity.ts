import { Location } from './location.entity';

export class Zone {
  id: number;
  tenantId: number;
  name: string;
  locations: Location[];
  active?: boolean;
  description?: string;

  constructor(
    id?: number,
    tenantId?: number,
    name?: string,
    locations: Location[] = [],
    active?: boolean,
    description?: string
  ) {
    this.id = id ?? 0;
    this.tenantId = tenantId ?? 0;
    this.name = name ?? '';
    this.locations = locations;
    this.active = active ?? true;
    this.description = description ?? '';
  }
}

export interface ZoneInfo {
  id: number;
  tenantId: number;
  name: string;
}
