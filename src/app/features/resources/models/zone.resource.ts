// Resource models for backend communication
export interface ZoneResource {
  zoneId: number;
  tenantId: number;
  name: string;
}

export interface CreateZoneResource {
  name: string;
}

export interface LocationResource {
  id: number;
  zoneId: number;
  street: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface CreateLocationResource {
  street: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface UpdateLocationStatusResource {
  status: string;
}
