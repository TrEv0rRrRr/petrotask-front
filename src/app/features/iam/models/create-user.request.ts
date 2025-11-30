export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}
