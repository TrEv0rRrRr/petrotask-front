import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {NgForOf} from '@angular/common';
import {ButtonComponent} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-payment-card',
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    ButtonComponent
  ],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export class PaymentCardComponent {
  @Input() title: string = 'title';
  @Input() items: string[] = [];
  @Input() price: string = '0.00';

  @Output() typeSaved = new EventEmitter<string>();

  onSaveType(): void {
    this.typeSaved.emit(this.title);
  }
}
