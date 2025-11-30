// Resource models for backend communication
export interface PositionResource {
  positionId: number;
  tenantId: number;
  title: string;
  description: string;
}

export interface CreatePositionResource {
  title: string;
  description: string;
} 