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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-photo-upload-dialog',
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
    MatProgressBarModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'photo-evidence.upload-photos' | translate }}</h2>
    
    <mat-dialog-content>
      <!-- Selector de archivos -->
      <div class="file-selector">
        <input type="file" 
               #fileInput 
               (change)="onFilesSelected($event)"
               accept="image/*" 
               multiple
               style="display: none;">
        <button mat-raised-button color="primary" (click)="fileInput.click()">
          <mat-icon>camera_alt</mat-icon>
          {{ 'photo-evidence.select-photos' | translate }}
        </button>
      </div>

      <!-- Preview de fotos -->
      <div class="photo-previews" *ngIf="photoPreviews.length > 0">
        <h3>{{ 'photo-evidence.selected-photos' | translate }}</h3>
        <div class="preview-grid">
          <mat-card *ngFor="let preview of photoPreviews; let i = index" class="preview-card">
            <img [src]="preview" alt="Preview {{ i + 1 }}">
            <mat-card-actions>
              <button mat-icon-button color="warn" (click)="removePhoto(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Formulario de información -->
      <div class="upload-form" *ngIf="photoPreviews.length > 0">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'photo-evidence.title' | translate }}</mat-label>
          <input matInput [(ngModel)]="uploadData.title" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'photo-evidence.description' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="uploadData.description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'photo-evidence.category' | translate }}</mat-label>
          <mat-select [(ngModel)]="uploadData.category" required>
            <mat-option *ngFor="let category of categories" [value]="category.value">
              <mat-icon>{{ category.icon }}</mat-icon>
              {{ category.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>{{ 'photo-evidence.location' | translate }}</mat-label>
          <input matInput [(ngModel)]="uploadData.location" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'photo-evidence.tags' | translate }}</mat-label>
          <mat-chip-grid #chipGrid>
            <mat-chip-row *ngFor="let tag of uploadData.tags" (removed)="removeTag(tag)">
              {{ tag }}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
          </mat-chip-grid>
          <input placeholder="{{ 'photo-evidence.add-tag' | translate }}"
                 [matChipInputFor]="chipGrid"
                 [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                 (matChipInputTokenEnd)="addTag($event)">
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'photo-evidence.cancel' | translate }}</button>
      <button mat-raised-button 
              color="primary" 
              (click)="onUpload()"
              [disabled]="!canUpload()">
        <mat-icon>cloud_upload</mat-icon>
        {{ 'photo-evidence.upload' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .file-selector {
      text-align: center;
      margin-bottom: 24px;
    }

    .photo-previews {
      margin-bottom: 24px;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .preview-card {
      img {
        width: 100%;
        height: 120px;
        object-fit: cover;
      }
    }

    .upload-form {
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

    @media (max-width: 600px) {
      .upload-form {
        grid-template-columns: 1fr;
      }
      
      .half-width {
        grid-column: span 1;
      }
    }
  `]
})
export class PhotoUploadDialogComponent {
  photoPreviews: string[] = [];
  uploadData = {
    title: '',
    description: '',
    category: '',
    location: '',
    tags: [] as string[]
  };

  separatorKeysCodes: number[] = [13, 188]; // Enter y coma

  constructor(
    public dialogRef: MatDialogRef<PhotoUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categories = data.categories;
    this.photoPreviews = data.photoPreviews || [];
  }

  categories: any[] = [];

  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.photoPreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removePhoto(index: number): void {
    this.photoPreviews.splice(index, 1);
  }

  addTag(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.uploadData.tags.includes(value)) {
      this.uploadData.tags.push(value);
    }
    event.chipInput.clear();
  }

  removeTag(tag: string): void {
    const index = this.uploadData.tags.indexOf(tag);
    if (index >= 0) {
      this.uploadData.tags.splice(index, 1);
    }
  }

  canUpload(): boolean {
    return this.photoPreviews.length > 0 && 
           this.uploadData.title.trim() !== '' && 
           this.uploadData.category !== '' && 
           this.uploadData.location.trim() !== '';
  }

  onUpload(): void {
    if (this.canUpload()) {
      this.dialogRef.close(this.uploadData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
