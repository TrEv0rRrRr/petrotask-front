import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { Zone } from '../../models/zone.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-zone-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatListModule,
    ButtonComponent,
    TranslatePipe
  ],
  templateUrl: './zone-card.component.html',
  styleUrls: ['./zone-card.component.scss']
})
export class ZoneCardComponent {
  @Input() zone!: Zone;
  @Input() isSelected = false;

  @Output() select = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Zone>();
  @Output() toggleActive = new EventEmitter<number>();
  @Output() addLocation = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}
