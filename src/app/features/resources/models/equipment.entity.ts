export class Equipment {
    id: number;
    tenantId: number;
    name: string;
    status: string;
    code: string;
    plate: string;
    capacityLoad: number;
    capacityPax: number;

    constructor(equipment: {
        id?: number, 
        tenantId?: number,
        name?: string,
        status?: string,
        code?: string,
        plate?: string,
        capacityLoad?: number,
        capacityPax?: number
    }) {
        this.id = equipment.id || 0;
        this.tenantId = equipment.tenantId || 0;
        this.name = equipment.name || '';
        this.status = equipment.status || '';
        this.code = equipment.code || '';
        this.plate = equipment.plate || '';
        this.capacityLoad = equipment.capacityLoad || 0;
        this.capacityPax = equipment.capacityPax || 0;
    }
}

