import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipment } from '../../models/equipment.entity';
import { EquipmentCardComponent } from '../equipment-card/equipment-card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [CommonModule, EquipmentCardComponent, TranslatePipe],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.scss'
})
export class EquipmentListComponent {
  @Input() equipmentList: Equipment[] = [];

  @Output() edit = new EventEmitter<Equipment>();
  @Output() statusChange = new EventEmitter<{ equipment: Equipment, newStatus: string }>();
  @Output() uploadPhoto = new EventEmitter<Equipment>();

  onEdit(equipment: Equipment): void {
    this.edit.emit(equipment);
  }

  onStatusChange(equipment: Equipment): void {
    const newStatus = equipment.status === 'Disponible' ? 'Mantenimiento' : 'Disponible';
    this.statusChange.emit({ equipment, newStatus });
  }

  onUploadPhoto(equipment: Equipment): void {
    this.uploadPhoto.emit(equipment);
  }
}
