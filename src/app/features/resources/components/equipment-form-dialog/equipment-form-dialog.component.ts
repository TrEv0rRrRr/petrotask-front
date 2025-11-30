import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Equipment } from '../../models/equipment.entity';
import { BaseFormComponent, FormConfig } from '../../../../shared/components/base-form/base-form.component';
import { UiService } from '../../../../core/services/ui.service';

export interface EquipmentDialogData {
  equipment: Equipment;
  title: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-equipment-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    BaseFormComponent
  ],
  templateUrl: './equipment-form-dialog.component.html',
  styleUrl: './equipment-form-dialog.component.scss'
})
export class EquipmentFormDialogComponent implements OnInit {
  formConfig: FormConfig = { fields: [] };
  initialValues: any = {};
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<EquipmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EquipmentDialogData,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.setupForm();
    this.updateFormConfig();
  }

  private setupForm(): void {
    this.initialValues = {
      name: this.data.equipment.name || '',
      code: this.data.equipment.code || '',
      plate: this.data.equipment.plate || '',
      capacityLoad: this.data.equipment.capacityLoad || 0,
      capacityPax: this.data.equipment.capacityPax || 0,
      status: this.data.equipment.status || 'AVAILABLE'
    };
  }

  private updateFormConfig(): void {
    this.formConfig = {
      fields: [
        {
          key: 'name',
          type: 'text',
          labelKey: 'equipment.form.name',
          label: 'Equipment Name',
          placeholderKey: 'equipment.form.placeholders.name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100
          }
        },
        {
          key: 'code',
          type: 'text',
          labelKey: 'equipment.form.code',
          label: 'Equipment Code',
          placeholderKey: 'equipment.form.placeholders.code',
          required: true,
          validation: {
            minLength: 3,
            maxLength: 20,
            pattern: '^[A-Z0-9\\-]+$'
          },
          customErrorMessages: {
            pattern: 'Code must contain only uppercase letters, numbers and hyphens'
          }
        },
        {
          key: 'plate',
          type: 'text',
          labelKey: 'equipment.form.plate',
          label: 'License Plate',
          placeholderKey: 'equipment.form.placeholders.plate',
          required: true,
          validation: {
            minLength: 6,
            maxLength: 10,
            pattern: '^[A-Z0-9\\-]+$'
          },
          customErrorMessages: {
            pattern: 'Plate must contain only uppercase letters, numbers and hyphens'
          }
        },
        {
          key: 'capacityLoad',
          type: 'number',
          labelKey: 'equipment.form.capacityLoad',
          label: 'Load Capacity (kg)',
          placeholderKey: 'equipment.form.placeholders.capacityLoad',
          required: true,
          validation: {
            min: 0,
            max: 50000
          }
        },
        {
          key: 'capacityPax',
          type: 'number',
          labelKey: 'equipment.form.capacityPax',
          label: 'Passenger Capacity',
          placeholderKey: 'equipment.form.placeholders.capacityPax',
          required: true,
          validation: {
            min: 1,
            max: 100
          }
        },
        {
          key: 'status',
          type: 'select',
          labelKey: 'equipment.form.status',
          label: 'Status',
          required: true,
          options: [
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'MAINTENANCE', label: 'Maintenance' },
            { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
            { value: 'RESERVED', label: 'Reserved' }
          ]
        }
      ],
      submitButtonTextKey: this.data.isEdit ? 'common.update' : 'common.create',
      cancelButtonTextKey: 'common.cancel',
      showCancelButton: true,
      layout: 'vertical',
      size: 'medium'
    };
  }

  onFormSubmit(formValue: any): void {
    this.isSubmitting = true;
    
    const equipmentData: Equipment = new Equipment({
      id: this.data.isEdit ? this.data.equipment.id : 0,
      tenantId: this.data.equipment.tenantId || 1, // Default tenant ID
      name: formValue.name,
      status: formValue.status,
      code: formValue.code,
      plate: formValue.plate,
      capacityLoad: formValue.capacityLoad,
      capacityPax: formValue.capacityPax
    });

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(equipmentData);
    }, 1000);
  }

  onFormCancel(): void {
    this.dialogRef.close();
  }
}
