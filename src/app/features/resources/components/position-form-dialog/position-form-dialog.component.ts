import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Position } from '../../models/position.entity';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

export interface PositionFormDialogData {
  position: Position;
  title: string;
  isEdit: boolean;
}

@Component({
  selector: 'app-position-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    ButtonComponent,
    InputComponent
  ],
  templateUrl: './position-form-dialog.component.html',
  styleUrl: './position-form-dialog.component.scss'
})
export class PositionFormDialogComponent {
  positionForm: FormGroup;
  isEdit: boolean;
  title: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PositionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PositionFormDialogData
  ) {
    this.isEdit = data.isEdit;
    this.title = data.title;

    this.positionForm = this.fb.group({
      title: [data.position.title || '', [Validators.required, Validators.minLength(2)]],
      description: [data.position.description || '', [Validators.required, Validators.minLength(5)]]
    });
  }

  get titleControl() {
    return this.positionForm.get('title');
  }

  get descriptionControl() {
    return this.positionForm.get('description');
  }

  get titleError(): string {
    if (this.titleControl?.hasError('required')) {
      return 'POSITION_MANAGEMENT.FORM.TITLE_REQUIRED';
    }
    if (this.titleControl?.hasError('minlength')) {
      return 'POSITION_MANAGEMENT.FORM.TITLE_MIN_LENGTH';
    }
    return '';
  }

  get descriptionError(): string {
    if (this.descriptionControl?.hasError('required')) {
      return 'POSITION_MANAGEMENT.FORM.DESCRIPTION_REQUIRED';
    }
    if (this.descriptionControl?.hasError('minlength')) {
      return 'POSITION_MANAGEMENT.FORM.DESCRIPTION_MIN_LENGTH';
    }
    return '';
  }

  onSave(): void {
    if (this.positionForm.valid) {
      const formData = this.positionForm.value;
      
      const position = new Position(
        this.data.position.id,
        this.data.position.tenantId || 1,
        formData.title,
        formData.description
      );

      this.dialogRef.close(position);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.positionForm.controls).forEach(key => {
        this.positionForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 