import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { 
  ConfirmationDialogComponent, 
  ConfirmationDialogData 
} from '../components/confirmation-dialog/confirmation-dialog.component';
import {
  RescheduleDialogComponent,
  RescheduleDialogData
} from '../components/reschedule-dialog/reschedule-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Abre un diálogo de confirmación con el título y mensaje especificados
   * @param data Datos del diálogo (título, mensaje, textos de botones)
   * @param width Ancho del diálogo (por defecto '400px')
   * @returns Observable que emite true si se confirma, false si se cancela
   */
  confirm(data: ConfirmationDialogData, width: string = '400px'): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: width,
      data: data,
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
  
  /**
   * Abre un diálogo de reprogramación con la información de la tarea
   * @param data Datos del diálogo (nombre tarea, tiempo anterior, nuevo tiempo)
   * @param width Ancho del diálogo (por defecto '400px')
   * @returns Observable que emite true si se confirma, false si se cancela
   */
  reschedule(data: RescheduleDialogData, width: string = '400px'): Observable<boolean> {
    const dialogRef = this.dialog.open(RescheduleDialogComponent, {
      width: width,
      data: data,
      disableClose: true
    });

    return dialogRef.afterClosed();
  }
} 