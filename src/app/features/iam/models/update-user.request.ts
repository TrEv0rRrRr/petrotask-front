export interface UpdateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface UpdateUserStatusRequest{
    active: boolean;
}