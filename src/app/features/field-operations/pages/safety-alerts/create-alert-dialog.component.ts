import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'safety-alerts.create-new-alert' | translate }}</h2>
    
    <mat-dialog-content>
      <form class="alert-form">
        <!-- Título de la alerta -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'safety-alerts.alert-title' | translate }}</mat-label>
          <input matInput [(ngModel)]="alertData.title" name="title" required>
        </mat-form-field>

        <!-- Descripción -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'safety-alerts.description' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="alertData.description" name="description" rows="4" required></textarea>
        </mat-form-field>

        <!-- Tipo y Prioridad -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>{{ 'safety-alerts.alert-type' | translate }}</mat-label>
            <mat-select [(ngModel)]="alertData.type" name="type" required>
              <mat-option *ngFor="let type of alertTypes" [value]="type.value">
                <mat-icon>{{ type.icon }}</mat-icon>
                {{ type.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>{{ 'safety-alerts.priority' | translate }}</mat-label>
            <mat-select [(ngModel)]="alertData.priority" name="priority" required>
              <mat-option *ngFor="let priority of priorities" [value]="priority.value">
                {{ priority.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Ubicación -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'safety-alerts.location' | translate }}</mat-label>
          <input matInput [(ngModel)]="alertData.location" name="location" required>
        </mat-form-field>

        <!-- Fecha de vencimiento -->
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'safety-alerts.due-date' | translate }}</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="alertData.dueDate" name="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <!-- Asignado a -->
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'safety-alerts.assigned-to' | translate }}</mat-label>
          <input matInput [(ngModel)]="alertData.assignedTo" name="assignedTo">
        </mat-form-field>

        <!-- Acciones requeridas -->
        <div class="actions-section">
          <h4>{{ 'safety-alerts.required-actions' | translate }}</h4>
          <div class="actions-list">
            <div *ngFor="let action of alertData.actions; let i = index" class="action-item">
              <mat-form-field appearance="outline" class="action-input">
                <mat-label>{{ 'safety-alerts.action' | translate }} {{ i + 1 }}</mat-label>
                <input matInput [(ngModel)]="alertData.actions[i]" name="action{{i}}">
              </mat-form-field>
              <button mat-icon-button color="warn" (click)="removeAction(i)" *ngIf="alertData.actions.length > 1">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <button mat-stroked-button (click)="addAction()" class="add-action-btn">
              <mat-icon>add</mat-icon>
              {{ 'safety-alerts.add-action' | translate }}
            </button>
          </div>
        </div>

        <!-- Notas adicionales -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'safety-alerts.additional-notes' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="alertData.notes" name="notes" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'safety-alerts.cancel' | translate }}</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onCreate()"
              [disabled]="!canCreate()">
        <mat-icon>add_alert</mat-icon>
        {{ 'safety-alerts.create-alert' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .alert-form {
      display: grid;
      gap: 16px;
      min-width: 500px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .half-width {
      grid-column: span 1;
    }

    .actions-section {
      grid-column: 1 / -1;
    }

    .actions-section h4 {
      margin: 16px 0 8px 0;
      color: var(--text-primary);
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-input {
      flex: 1;
    }

    .add-action-btn {
      align-self: flex-start;
      margin-top: 8px;
    }

    @media (max-width: 600px) {
      .alert-form {
        min-width: 300px;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .half-width {
        grid-column: span 1;
      }
    }
  `]
})
export class CreateAlertDialogComponent {
  alertData = {
    title: '',
    description: '',
    type: '',
    priority: '',
    location: '',
    dueDate: null as Date | null,
    assignedTo: '',
    actions: [''],
    notes: ''
  };

  alertTypes = [
    { value: 'critical', label: 'Crítica', icon: 'error' },
    { value: 'warning', label: 'Advertencia', icon: 'warning' },
    { value: 'info', label: 'Informativa', icon: 'info' },
    { value: 'maintenance', label: 'Mantenimiento', icon: 'build' }
  ];

  priorities = [
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  addAction(): void {
    this.alertData.actions.push('');
  }

  removeAction(index: number): void {
    this.alertData.actions.splice(index, 1);
  }

  canCreate(): boolean {
    return this.alertData.title.trim() !== '' && 
           this.alertData.description.trim() !== '' && 
           this.alertData.type !== '' && 
           this.alertData.priority !== '' && 
           this.alertData.location.trim() !== '' &&
           this.alertData.actions.some(action => action.trim() !== '');
  }

  onCreate(): void {
    if (this.canCreate()) {
      // Filtrar acciones vacías
      this.alertData.actions = this.alertData.actions.filter(action => action.trim() !== '');
      this.dialogRef.close(this.alertData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
