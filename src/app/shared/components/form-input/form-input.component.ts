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
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() labelTranslateKey: string = '';
  @Input() placeholder: string = '';
  @Input() placeholderTranslateKey: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() hasError: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'outlined' | 'filled' | 'standard' = 'outlined';

  @Output() valueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  private _value: any = '';
  private _onChange = (value: any) => {};
  private _onTouched = () => {};

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
    this._onChange(value);
    this.valueChange.emit(value);
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  onBlur(): void {
    this._onTouched();
    this.blur.emit();
  }

  onFocus(): void {
    this.focus.emit();
  }

  getCssClasses(): string {
    const classes = [
      'form-input',
      `form-input--${this.size}`,
      `form-input--${this.variant}`,
    ];

    if (this.hasError) {
      classes.push('form-input--error');
    }

    if (this.disabled) {
      classes.push('form-input--disabled');
    }

    if (this.readonly) {
      classes.push('form-input--readonly');
    }

    return classes.join(' ');
  }
}
