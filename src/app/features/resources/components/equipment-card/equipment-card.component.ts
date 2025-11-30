import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Equipment } from '../../models/equipment.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-equipment-card',
  standalone: true,
    imports: [CommonModule, ButtonComponent, TranslatePipe],
  templateUrl: './equipment-card.component.html',
  styleUrl: './equipment-card.component.scss'
})
export class EquipmentCardComponent {
  @Input() equipment!: Equipment;

  @Output() edit = new EventEmitter<Equipment>();
  @Output() statusChange = new EventEmitter<Equipment>();
  @Output() uploadPhoto = new EventEmitter<Equipment>();

  onEdit(): void {
    this.edit.emit(this.equipment);
  }

  onStatusChange(): void {
    this.statusChange.emit(this.equipment);
  }

  onUploadPhoto(): void {
    this.uploadPhoto.emit(this.equipment);
  }
}
