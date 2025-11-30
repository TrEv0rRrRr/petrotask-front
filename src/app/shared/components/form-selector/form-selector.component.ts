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

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-selector.component.html',
  styleUrl: './form-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectorComponent),
      multi: true,
    },
  ],
})
export class FormSelectorComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() labelTranslateKey: string = '';
  @Input() placeholder: string = '';
  @Input() placeholderTranslateKey: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() hasError: boolean = false;
  @Input() multiple: boolean = false;
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

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = this.multiple
      ? Array.from(target.selectedOptions).map((option) => option.value)
      : target.value;
    this.value = value;
  }

  addSelection(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    if (selectedValue && this.multiple) {
      const currentValues = Array.isArray(this.value) ? this.value : [];
      if (!currentValues.includes(selectedValue)) {
        this.value = [...currentValues, selectedValue];
      }
      // Reset el select
      target.value = '';
    }
  }

  removeSelection(valueToRemove: any): void {
    if (this.multiple && Array.isArray(this.value)) {
      this.value = this.value.filter((v) => v !== valueToRemove);
    }
  }

  getSelectedOptions(): SelectOption[] {
    if (!this.multiple || !Array.isArray(this.value)) {
      return [];
    }

    return this.value.map((val) => {
      const option = this.options.find((opt) => opt.value === val);
      return option || { value: val, label: val.toString() };
    });
  }

  getAvailableOptions(): SelectOption[] {
    if (!this.multiple) {
      return this.options;
    }

    const selectedValues = Array.isArray(this.value) ? this.value : [];
    return this.options.filter(
      (option) => !selectedValues.includes(option.value)
    );
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
      'form-selector',
      `form-selector--${this.size}`,
      `form-selector--${this.variant}`,
    ];

    if (this.hasError) {
      classes.push('form-selector--error');
    }

    if (this.disabled) {
      classes.push('form-selector--disabled');
    }

    if (this.multiple) {
      classes.push('form-selector--multiple');
    }

    return classes.join(' ');
  }
}
