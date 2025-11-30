import { Roles } from "./roles.enum";

export class User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Roles[];
    status: boolean;
    
    constructor(
        id?: number,
        username?: string,
        email?: string,
        firstName?: string,
        lastName?: string,
        roles?: Roles[],
        status?: boolean
    ) {
        this.id = id || 0;
        this.username = username || '';
        this.email = email || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.roles = roles || [];
        this.status = status || false;
    }
}
