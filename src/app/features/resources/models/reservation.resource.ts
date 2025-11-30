// Resource models for backend communication
export interface ReservationResource {
  reservationId: number;
  tenantId: number;
  resourceType: string;
  resourceId: number;
  start: string; // ISO date string
  end: string; // ISO date string
}

export interface CreateReservationResource {
  resourceType: string;
  resourceId: number;
  start: string; // ISO date string
  end: string; // ISO date string
} 