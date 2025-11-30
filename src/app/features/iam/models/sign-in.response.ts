export class SignInResponse {
  public id: number;
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public token: string;
  public roles: string[];
  public companyId?: number;

  constructor(data: {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
    roles: string[],
    companyId?: number
  }) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.token = data.token;
    this.roles = data.roles;
    this.companyId = data.companyId;
  }
}
