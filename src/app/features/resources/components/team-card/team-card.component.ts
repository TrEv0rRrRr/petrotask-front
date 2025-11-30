import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Team } from '../../models/team.entity';
import { TeamMember } from '../../models/team-member.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDividerModule,
    ButtonComponent,
    TranslatePipe
  ],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.scss'
})
export class TeamCardComponent {
  @Input() team!: Team;
  @Output() edit = new EventEmitter<Team>();
  @Output() editMembers = new EventEmitter<Team>();
  @Output() toggleStatus = new EventEmitter<Team>();
  @Output() delete = new EventEmitter<Team>();

  isExpanded = false;

  constructor() {}

  onEdit(): void {
    this.edit.emit(this.team);
  }

  onEditMembers(): void {
    this.editMembers.emit(this.team);
  }

  onToggleStatus(): void {
    this.toggleStatus.emit(this.team);
  }

  onDelete(): void {
    this.delete.emit(this.team);
  }

  // Helper method to format the date
  formatDate(date: Date): string {
    if (!date) return '';

    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to get action button label
  get statusActionLabel(): string {
    return this.team.status === 'ACTIVE' ? 'Desactivar' : 'Activar';
  }

  // Helper method to get status color for Material components
  get statusColor(): string {
    return this.team.status === 'ACTIVE' ? 'primary' : 'warn';
  }

  // Helper method to get status color for our ButtonComponent
  get buttonStatusColor(): 'primary' | 'secondary' | 'danger' {
    return this.team.status === 'ACTIVE' ? 'danger' : 'primary';
  }

  // Helper methods for status and count badges
  get statusBadge(): string {
    return this.team.status === 'ACTIVE' ? 'Activo' : 'Inactivo';
  }

  get memberCount(): number {
    return this.team.members?.length || 0;
  }
}
