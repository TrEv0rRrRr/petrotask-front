import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ContentChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectorComponent, SelectOption } from '../form-selector/form-selector.component';

export interface FormField {
  key: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'custom';
  label: string;
  labelKey?: string; // Para i18n
  placeholder?: string;
  placeholderKey?: string; // Para i18n
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: SelectOption[]; // Para select
  multiple?: boolean; // Para select múltiple
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    custom?: (control: AbstractControl) => { [key: string]: any } | null;
  };
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  helpText?: string;
  helpTextKey?: string; // Para i18n
  customErrorMessages?: { [key: string]: string };
  conditionalDisplay?: (formValue: any) => boolean;
  // Para campos personalizados
  customTemplate?: string; // Nombre del template
  customData?: any; // Datos adicionales para el template
  customClass?: string; // Clases CSS adicionales
  customHeight?: string; // Altura personalizada
}

export interface FormConfig {
  fields: FormField[];
  submitButtonText?: string;
  submitButtonTextKey?: string; // Para i18n
  cancelButtonText?: string;
  cancelButtonTextKey?: string; // Para i18n
  showCancelButton?: boolean;
  layout?: 'vertical' | 'horizontal' | 'inline';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
}

@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TranslateModule,
    FormInputComponent,
    FormSelectorComponent
  ],
  templateUrl: './base-form.component.html',
  styleUrl: './base-form.component.scss'
})
export class BaseFormComponent implements OnInit, OnDestroy {
  @Input() config: FormConfig = { fields: [] };
  @Input() initialValues: any = {};
  @Input() isSubmitting: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formValueChange = new EventEmitter<any>();
  @Output() customFieldEvent = new EventEmitter<{fieldKey: string, event: string, data: any}>();

  // Content projection para templates personalizados
  @ContentChild('customTemplate', { read: TemplateRef }) customTemplate?: TemplateRef<any>;

  form: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.subscribeToFormChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    const formControls: { [key: string]: AbstractControl } = {};

    this.config.fields.forEach(field => {
      // Solo crear controles para campos que no sean custom o que necesiten validación
      if (field.type !== 'custom' || field.validation || field.required) {
        const validators = this.buildValidators(field);
        const initialValue = this.initialValues[field.key] || '';
        
        formControls[field.key] = this.fb.control(
          { value: initialValue, disabled: field.disabled || false },
          validators
        );
      }
    });

    this.form = this.fb.group(formControls);
  }

  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.validation) {
      const { minLength, maxLength, pattern, min, max, custom } = field.validation;
      
      if (minLength) {
        validators.push(Validators.minLength(minLength));
      }
      
      if (maxLength) {
        validators.push(Validators.maxLength(maxLength));
      }
      
      if (pattern) {
        validators.push(Validators.pattern(pattern));
      }
      
      if (min !== undefined) {
        validators.push(Validators.min(min));
      }
      
      if (max !== undefined) {
        validators.push(Validators.max(max));
      }
      
      if (custom) {
        validators.push(custom);
      }
    }

    return validators;
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.formValueChange.emit(value);
      });
  }

  getFieldLabel(field: FormField): string {
    if (field.labelKey) {
      return this.translate.instant(field.labelKey);
    }
    return field.label;
  }

  getFieldPlaceholder(field: FormField): string {
    if (field.placeholderKey) {
      return this.translate.instant(field.placeholderKey);
    }
    if (field.placeholder) {
      return field.placeholder;
    }
    // Placeholder por defecto usando i18n
    return this.translate.instant('form.placeholders.enter') + ' ' + this.getFieldLabel(field).toLowerCase();
  }

  getFieldHelpText(field: FormField): string {
    if (field.helpTextKey) {
      return this.translate.instant(field.helpTextKey);
    }
    return field.helpText || '';
  }

  getFieldErrorMessage(field: FormField): string {
    const control = this.form.get(field.key);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    
    // Buscar mensaje personalizado primero
    if (field.customErrorMessages) {
      for (const errorKey in errors) {
        if (field.customErrorMessages[errorKey]) {
          return field.customErrorMessages[errorKey];
        }
      }
    }

    // Usar mensajes de i18n por defecto
    for (const errorKey in errors) {
      const errorValue = errors[errorKey];
      switch (errorKey) {
        case 'required':
          return this.translate.instant('form.errors.required');
        case 'email':
          return this.translate.instant('form.errors.email');
        case 'minlength':
          return this.translate.instant('form.errors.minLength', { length: errorValue.requiredLength });
        case 'maxlength':
          return this.translate.instant('form.errors.maxLength', { length: errorValue.requiredLength });
        case 'min':
          return this.translate.instant('form.errors.min', { min: errorValue.min });
        case 'max':
          return this.translate.instant('form.errors.max', { max: errorValue.max });
        case 'pattern':
          return this.translate.instant('form.errors.pattern');
        default:
          return this.translate.instant('form.errors.pattern');
      }
    }

    return '';
  }

  hasFieldError(field: FormField): boolean {
    const control = this.form.get(field.key);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  shouldShowField(field: FormField): boolean {
    if (field.conditionalDisplay) {
      return field.conditionalDisplay(this.form.value);
    }
    return true;
  }

  getSubmitButtonText(): string {
    if (this.config.submitButtonTextKey) {
      return this.translate.instant(this.config.submitButtonTextKey);
    }
    return this.config.submitButtonText || this.translate.instant('form.actions.submit');
  }

  getCancelButtonText(): string {
    if (this.config.cancelButtonTextKey) {
      return this.translate.instant(this.config.cancelButtonTextKey);
    }
    return this.config.cancelButtonText || this.translate.instant('form.actions.cancel');
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  resetForm(): void {
    this.form.reset();
  }

  patchFormValue(value: any): void {
    this.form.patchValue(value);
  }

  getFormCssClasses(): string {
    const classes = [
      'base-form',
      `base-form--${this.config.layout || 'vertical'}`,
      `base-form--${this.config.size || 'medium'}`
    ];

    if (this.isSubmitting) {
      classes.push('base-form--submitting');
    }

    return classes.join(' ');
  }

  // Métodos para campos personalizados
  onCustomFieldEvent(fieldKey: string, event: string, data: any): void {
    this.customFieldEvent.emit({ fieldKey, event, data });
  }

  updateCustomFieldValue(fieldKey: string, value: any): void {
    const control = this.form.get(fieldKey);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
    }
  }

  getCustomFieldContext(field: FormField) {
    return {
      field: field,
      value: this.form.get(field.key)?.value,
      form: this.form,
      hasError: this.hasFieldError(field),
      errorMessage: this.getFieldErrorMessage(field),
      helpText: this.getFieldHelpText(field),
      onEvent: (event: string, data: any) => this.onCustomFieldEvent(field.key, event, data),
      updateValue: (value: any) => this.updateCustomFieldValue(field.key, value)
    };
  }
}
