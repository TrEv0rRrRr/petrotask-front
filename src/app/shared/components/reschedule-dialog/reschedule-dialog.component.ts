import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface RescheduleDialogData {
  taskName: string;
  oldTime: string;
  newTime: string;
  cancelText?: string;
  confirmText?: string;
}

@Component({
  selector: 'app-reschedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './reschedule-dialog.component.html',
  styleUrls: ['./reschedule-dialog.component.scss']
})
export class RescheduleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RescheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RescheduleDialogData
  ) {
    // Establecer textos por defecto si no se proporcionan
    this.data = {
      ...data,
      cancelText: data.cancelText || 'Cancelar',
      confirmText: data.confirmText || 'Reprogramar'
    };
  }
}
