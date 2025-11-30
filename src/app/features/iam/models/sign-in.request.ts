export class SignInRequest {
  public username: string;
  public password: string;

  constructor(data: {
    username: string,
    password: string
  }) {
    this.username = data.username;
    this.password = data.password;
  }
}
