import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // Basic properties
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() placeholderTranslateKey?: string;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() pattern?: string;
  @Input() autocomplete?: string;

  // Design properties
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'neutral' = 'primary';
  @Input() variant: 'solid' | 'outline' | 'ghost' = 'outline';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() fullWidth: boolean = false;
  @Input() rounded: boolean = false;

  // Label and help
  @Input() label?: string;
  @Input() labelTranslateKey?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;

  // Icons and actions
  @Input() leadingIcon?: string;
  @Input() trailingIcon?: string;
  @Input() clearable: boolean = false;
  @Input() loading: boolean = false;

  // Output events
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Output() keyup = new EventEmitter<KeyboardEvent>();
  @Output() trailingIconClick = new EventEmitter<MouseEvent>();

  @Input() value = '';
  focused = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  get inputClasses(): string {
    const classes = [
      'input',
      `color-${this.color}`,
      `variant-${this.variant}`,
      `size-${this.size}`,
    ];

    if (this.disabled) classes.push('disabled');
    if (this.readonly) classes.push('readonly');
    if (this.required) classes.push('required');
    if (this.fullWidth) classes.push('full-width');
    if (this.rounded) classes.push('rounded');
    if (this.focused) classes.push('focused');
    if (this.errorMessage) classes.push('error');
    if (this.loading) classes.push('loading');
    if (this.leadingIcon) classes.push('has-leading-icon');
    if (this.trailingIcon || this.clearable) classes.push('has-trailing-icon');

    return classes.join(' ');
  }

  get showClearButton(): boolean {
    return this.clearable && !!this.value && !this.disabled && !this.readonly;
  }

  get inputType(): string {
    return this.type;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInputChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
    this.onChange(this.value);
  }

  onInputBlur(event: FocusEvent): void {
    this.focused = false;
    this.blur.emit(event);
    this.onTouched();
  }

  onInputFocus(event: FocusEvent): void {
    this.focused = true;
    this.focus.emit(event);
  }

  onInputKeydown(event: KeyboardEvent): void {
    this.keydown.emit(event);
  }

  onInputKeyup(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

  onClear(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.onChange(this.value);
  }

  onTrailingIconClick(event: MouseEvent): void {
    this.trailingIconClick.emit(event);
  }
}
