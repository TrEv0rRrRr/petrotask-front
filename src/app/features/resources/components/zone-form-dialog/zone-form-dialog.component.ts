import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Zone } from '../../models/zone.entity';
import { BaseFormComponent, FormConfig } from '../../../../shared/components/base-form/base-form.component';
import { UiService } from '../../../../core/services/ui.service';

export interface ZoneDialogData {
  zone: Zone;
  title: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-zone-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    BaseFormComponent
  ],
  templateUrl: './zone-form-dialog.component.html',
  styleUrl: './zone-form-dialog.component.scss'
})
export class ZoneFormDialogComponent implements OnInit {
  formConfig: FormConfig = { fields: [] };
  initialValues: any = {};
  isSubmitting = false;

  constructor(
    public dialogRef: MatDialogRef<ZoneFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ZoneDialogData,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.setupForm();
    this.updateFormConfig();
  }

  private setupForm(): void {
    this.initialValues = {
      name: this.data.zone?.name || ''
    };
  }

  private updateFormConfig(): void {
    this.formConfig = {
      fields: [
        {
          key: 'name',
          type: 'text',
          labelKey: 'zone.form.name',
          label: 'Zone Name',
          placeholderKey: 'zone.form.placeholders.name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100
          }
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
    
    const zoneData: Zone = new Zone(
      this.data.isEdit ? this.data.zone?.id || 0 : 0,
      this.data.zone?.tenantId || 1, // Default tenant ID
      formValue.name
    );

    // Simulate async operation
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(zoneData);
    }, 1000);
  }

  onFormCancel(): void {
    this.dialogRef.close();
  }
}
