export class Location {
  id: number;
  zoneId: number;
  street: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
  name?: string;
  description?: string;

  constructor(
    id: number,
    zoneId: number,
    street: string,
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    status: string,
    name?: string,
    description?: string
  ) {
    this.id = id;
    this.zoneId = zoneId;
    this.street = street;
    this.city = city;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
    this.status = status;
    this.name = name || this.address;
    this.description = description || this.address;
  }

  get address(): string {
    return `${this.street}, ${this.city}, ${this.country}`;
  }
}
