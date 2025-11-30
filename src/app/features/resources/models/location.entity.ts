export class Location {
    id: number;
    zoneId: number;
    street: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    status: string;

    constructor(
        id: number,
        zoneId: number,
        street: string,
        city: string,
        country: string,
        latitude: number,
        longitude: number,
        status: string
    ) {
        this.id = id;
        this.zoneId = zoneId;
        this.street = street;
        this.city = city;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
    }

    get address(): string {
        return `${this.street}, ${this.city}, ${this.country}`;
    }
}
