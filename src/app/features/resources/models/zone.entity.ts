import { Location } from "./location.entity";

export class Zone {
    id: number;
    tenantId: number;
    name: string;
    locations: Location[];
    
    constructor(
        id?: number,
        tenantId?: number,
        name?: string,
        locations: Location[] = []
    ) {
        this.id = id ?? 0;
        this.tenantId = tenantId ?? 0;
        this.name = name ?? '';
        this.locations = locations;
    }
}

export interface ZoneInfo {
    id: number;
    tenantId: number;
    name: string;
}