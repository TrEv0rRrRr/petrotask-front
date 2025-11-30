export class SignUpResponse {
    public id: number;
    public username: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public active: boolean;
    public roles: string[];
    public companyId?: number;
    public message?: string;
  
    constructor(data: {
      id: number,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      active: boolean,
      roles: string[],
      companyId?: number,
      message?: string
    }) {
      this.id = data.id;
      this.username = data.username;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.active = data.active;
      this.roles = data.roles;
      this.companyId = data.companyId;
      this.message = data.message;
    }
  }
  