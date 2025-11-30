import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '../../models/location.entity';
import { BaseFormComponent, FormConfig } from '../../../../shared/components/base-form/base-form.component';
import { UiService } from '../../../../core/services/ui.service';

export interface LocationDialogData {
  location: Location;
  title: string;
  isEdit: boolean;
  zoneId?: number;
}

@Component({
  selector: 'app-location-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    BaseFormComponent
  ],
  templateUrl: './location-form-dialog.component.html',
  styleUrl: './location-form-dialog.component.scss'
})
export class LocationFormDialogComponent implements OnInit {
  formConfig: FormConfig = { fields: [] };
  initialValues: any = {};
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<LocationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationDialogData,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.setupForm();
    this.updateFormConfig();
  }

  private setupForm(): void {
    this.initialValues = {
      street: this.data.location?.street || '',
      city: this.data.location?.city || '',
      country: this.data.location?.country || '',
      latitude: this.data.location?.latitude || 0,
      longitude: this.data.location?.longitude || 0,
      status: this.data.location?.status || 'ACTIVE'
    };
  }

  private updateFormConfig(): void {
    this.formConfig = {
      fields: [
        {
          key: 'street',
          type: 'text',
          labelKey: 'location.form.street',
          label: 'Street Address',
          placeholderKey: 'location.form.placeholders.street',
          required: true,
          validation: {
            minLength: 5,
            maxLength: 200
          }
        },
        {
          key: 'city',
          type: 'text',
          labelKey: 'location.form.city',
          label: 'City',
          placeholderKey: 'location.form.placeholders.city',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100
          }
        },
        {
          key: 'country',
          type: 'text',
          labelKey: 'location.form.country',
          label: 'Country',
          placeholderKey: 'location.form.placeholders.country',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100
          }
        },
        {
          key: 'latitude',
          type: 'number',
          labelKey: 'location.form.latitude',
          label: 'Latitude',
          placeholderKey: 'location.form.placeholders.latitude',
          required: true,
          validation: {
            min: -90,
            max: 90
          }
        },
        {
          key: 'longitude',
          type: 'number',
          labelKey: 'location.form.longitude',
          label: 'Longitude',
          placeholderKey: 'location.form.placeholders.longitude',
          required: true,
          validation: {
            min: -180,
            max: 180
          }
        },
        {
          key: 'status',
          type: 'select',
          labelKey: 'location.form.status',
          label: 'Status',
          required: true,
          options: [
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' }
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
    
    const locationData: Location = new Location(
      this.data.isEdit ? this.data.location?.id || 0 : 0,
      this.data.zoneId || this.data.location?.zoneId || 1, // Zone ID
      formValue.street,
      formValue.city,
      formValue.country,
      formValue.latitude,
      formValue.longitude,
      formValue.status
    );

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(locationData);
    }, 1000);
  }

  onFormCancel(): void {
    this.dialogRef.close();
  }
}
