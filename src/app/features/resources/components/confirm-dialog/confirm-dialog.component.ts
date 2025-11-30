import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ButtonComponent,
    TranslatePipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <app-button
        [label]="'common.cancel' | translate"
        [color]="'secondary'"
        (clicked)="onNoClick()">
      </app-button>
      <app-button
        [label]="'common.confirm' | translate"
        [color]="'danger'"
        (clicked)="onYesClick()">
      </app-button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    p {
      margin: 16px 0;
      color: var(--text-secondary);
    }

    [mat-dialog-actions] {
      padding: 8px 0 0;
      margin-bottom: 0;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
    }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 