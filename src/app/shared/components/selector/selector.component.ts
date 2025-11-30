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

export interface SelectorOption {
  value: string;
  label: string;
  translateKey?: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-selector',
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true,
    },
  ],
})
export class SelectorComponent implements ControlValueAccessor {
  // Input options - can be simple strings or complex objects
  @Input() options: (string | SelectorOption)[] = [];
  @Input() placeholder?: string;
  @Input() placeholderTranslateKey?: string;
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'neutral' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'solid' | 'outline' | 'ghost' = 'outline';
  @Input() disabled = false;
  @Input() required = false;
  @Input() multiple = false;
  @Input() searchable = false;
  @Input() clearable = false;
  @Input() label?: string;
  @Input() labelTranslateKey?: string;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Input() loading = false;

  @Output() selectionChange = new EventEmitter<string | string[]>();
  @Output() searchChange = new EventEmitter<string>();

  selectedOption: string | string[] = this.multiple ? [] : '';
  searchTerm = '';
  isOpen = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  get selectorClasses(): string {
    const classes = [
      'selector',
      `color-${this.color}`,
      `size-${this.size}`,
      `variant-${this.variant}`,
    ];

    if (this.disabled) classes.push('disabled');
    if (this.required) classes.push('required');
    if (this.fullWidth) classes.push('full-width');
    if (this.isOpen) classes.push('open');
    if (this.errorMessage) classes.push('error');
    if (this.loading) classes.push('loading');

    return classes.join(' ');
  }

  get normalizedOptions(): SelectorOption[] {
    return this.options.map((option) => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }
      return option;
    });
  }

  get filteredOptions(): SelectorOption[] {
    if (!this.searchTerm) {
      return this.normalizedOptions;
    }

    return this.normalizedOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get displayValue(): string {
    if (this.multiple && Array.isArray(this.selectedOption)) {
      if (this.selectedOption.length === 0) {
        return this.getPlaceholderText();
      }
      if (this.selectedOption.length === 1) {
        const option = this.normalizedOptions.find(
          (opt) => opt.value === this.selectedOption[0]
        );
        return this.getOptionLabel(option);
      }
      return `${this.selectedOption.length} selected`;
    }

    if (this.selectedOption) {
      const option = this.normalizedOptions.find(
        (opt) => opt.value === this.selectedOption
      );
      return this.getOptionLabel(option);
    }

    return this.getPlaceholderText();
  }

  getPlaceholderText(): string {
    return this.placeholder || 'Select option';
  }

  get placeholderText(): string {
    return this.placeholder || 'Select option';
  }

  get shouldShowPlaceholder(): boolean {
    if (this.multiple && Array.isArray(this.selectedOption)) {
      return this.selectedOption.length === 0;
    }
    return !this.selectedOption;
  }

  getOptionLabel(option?: SelectorOption): string {
    if (!option) return '';
    return option.translateKey || option.label;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedOption = value ?? (this.multiple ? [] : '');
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
  onSelectorClick(): void {
    if (!this.disabled && !this.loading) {
      this.isOpen = !this.isOpen;
    }
  }

  onOptionClick(option: SelectorOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      const currentSelected = Array.isArray(this.selectedOption)
        ? this.selectedOption
        : [];
      const index = currentSelected.indexOf(option.value);

      if (index > -1) {
        currentSelected.splice(index, 1);
      } else {
        currentSelected.push(option.value);
      }

      this.selectedOption = [...currentSelected];
    } else {
      this.selectedOption = option.value;
      this.isOpen = false;
    }

    this.selectionChange.emit(this.selectedOption);
    this.onChange(this.selectedOption);
    this.onTouched();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchChange.emit(this.searchTerm);
  }

  onClear(): void {
    this.selectedOption = this.multiple ? [] : '';
    this.searchTerm = '';
    this.selectionChange.emit(this.selectedOption);
    this.onChange(this.selectedOption);
    this.onTouched();
  }

  onBlur(): void {
    setTimeout(() => {
      this.isOpen = false;
      this.onTouched();
    }, 150);
  }

  isSelected(option: SelectorOption): boolean {
    if (this.multiple && Array.isArray(this.selectedOption)) {
      return this.selectedOption.includes(option.value);
    }
    return this.selectedOption === option.value;
  }

  trackByValue(index: number, option: SelectorOption): string {
    return option.value;
  }
}
