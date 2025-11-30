export class Reservation {
    id: number;
    tenantId: number;
    resourceType: string;
    resourceId: number;
    start: Date;
    end: Date;

    constructor(
        id: number,
        tenantId: number,
        resourceType: string,
        resourceId: number,
        start: Date,
        end: Date
    ) {
        this.id = id;
        this.tenantId = tenantId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.start = start;
        this.end = end;
    }

    get duration(): number {
        return this.end.getTime() - this.start.getTime();
    }

    get durationInHours(): number {
        return this.duration / (1000 * 60 * 60);
    }
} 