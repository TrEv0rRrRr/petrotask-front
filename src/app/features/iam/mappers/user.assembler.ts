import { User } from "../models/user.entity";
import { UserResponse } from "../models/user.response";
import { CreateUserRequest } from "../models/create-user.request";
import { UpdateUserRequest, UpdateUserStatusRequest } from "../models/update-user.request";
import { Roles } from "../models/roles.enum";

export class UserAssembler {
    static toEntity(response: UserResponse): User {
        return new User(
            response.id,
            response.username,
            response.email,
            response.firstName,
            response.lastName,
            response.roles as Roles[],
            response.active
        );
    }

    static toResponse(entity: User): UserResponse {
        return {
            id: entity.id,
            username: entity.username,
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.lastName,
            active: entity.status,
            roles: entity.roles
        };
    }

    static toCreateRequest(entity: User, password: string): CreateUserRequest {
        return {
            username: entity.username,
            password: password,
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.lastName,
            roles: entity.roles
        };
    }

    static toUpdateRequest(entity: User): UpdateUserRequest {
        return {
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.lastName,
            roles: entity.roles
        };
    }

    static toUpdateStatusRequest(entity: User) : UpdateUserStatusRequest{
        return {
            active: entity.status
        };
    }
}

