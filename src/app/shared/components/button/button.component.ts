import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, TranslateModule]
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() translateKey?: string; // For i18n support
  @Input() translateParams?: any; // For i18n parameters
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() onlyIcon = false;
  @Input() color: 'primary' | 'secondary' | 'danger' | 'neutral' | 'success' | 'warning' = 'primary';
  @Input() variant: 'solid' | 'outline' | 'text' | 'ghost' = 'solid';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() rounded = false;
  @Input() elevation = true;
  @Input() ariaLabel?: string;
  @Input() tooltip?: string;

  @Output() clicked = new EventEmitter<Event>();

  get displayText(): string {
    if (this.translateKey) {
      return this.translateKey;
    }
    return this.label || '';
  }

  get buttonClasses(): string {
    const classes = [
      'button',
      `color-${this.color}`,
      `variant-${this.variant}`,
      `size-${this.size}`
    ];

    if (this.onlyIcon) classes.push('only-icon');
    if (this.fullWidth) classes.push('full-width');
    if (this.rounded) classes.push('rounded');
    if (!this.elevation) classes.push('no-elevation');
    if (this.loading) classes.push('loading');
    if (this.icon && this.iconPosition === 'left' && !this.onlyIcon) classes.push('icon-left');
    if (this.icon && this.iconPosition === 'right' && !this.onlyIcon) classes.push('icon-right');

    return classes.join(' ');
  }

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
