export class SignUpRequest {
  public ruc: string;
  public legalName: string;
  public commercialName: string;
  public address: string;
  public city: string;
  public country: string;
  public tenantPhone: string;
  public tenantEmail: string;
  public website: string;
  public username: string;
  public password: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public role?: string;

  constructor(data: {
    ruc: string,
    legalName: string,
    commercialName: string,
    address: string,
    city: string,
    country: string,
    tenantPhone: string,
    tenantEmail: string,
    website: string,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    role?: string
  }) {
    this.ruc = data.ruc;
    this.legalName = data.legalName;
    this.commercialName = data.commercialName;
    this.address = data.address;
    this.city = data.city;
    this.country = data.country;
    this.tenantPhone = data.tenantPhone;
    this.tenantEmail = data.tenantEmail;
    this.website = data.website;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
  }
}
