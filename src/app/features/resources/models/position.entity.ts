export class Position {
    id: number;
    tenantId: number;
    title: string;
    description: string;

    constructor(id?: number, tenantId?: number, title?: string, description?: string) {
        this.id = id ?? 0;
        this.tenantId = tenantId ?? 0;
        this.title = title ?? '';
        this.description = description ?? '';
    }
    
}
