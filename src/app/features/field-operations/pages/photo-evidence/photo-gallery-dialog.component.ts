import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-photo-gallery-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    TranslateModule
  ],
  template: `
    <div class="gallery-header">
      <h2 mat-dialog-title>{{ evidence.title }}</h2>
      <button mat-icon-button (click)="onClose()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <mat-dialog-content>
      <!-- Información de la evidencia -->
      <div class="evidence-info">
        <p><strong>{{ 'photo-evidence.description' | translate }}:</strong> {{ evidence.description }}</p>
        <p><strong>{{ 'photo-evidence.location' | translate }}:</strong> {{ evidence.location }}</p>
        <p><strong>{{ 'photo-evidence.category' | translate }}:</strong> {{ getCategoryLabel(evidence.category) }}</p>
        <p><strong>{{ 'photo-evidence.uploaded-by' | translate }}:</strong> {{ evidence.uploadedBy }}</p>
        <p><strong>{{ 'photo-evidence.date' | translate }}:</strong> {{ formatDate(evidence.timestamp) }}</p>
        
        <div class="tags" *ngIf="evidence.tags.length > 0">
          <mat-chip-set>
            <mat-chip *ngFor="let tag of evidence.tags">{{ tag }}</mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Galería de fotos -->
      <div class="photo-gallery">
        <div class="gallery-grid">
          <mat-card *ngFor="let photo of photos; let i = index" 
                    class="photo-card"
                    (click)="openFullscreen(i)">
            <img [src]="photo" [alt]="'Photo ' + (i + 1)" class="gallery-image">
            <mat-card-content class="photo-overlay">
              <mat-icon>zoom_in</mat-icon>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">{{ 'photo-evidence.close' | translate }}</button>
    </mat-dialog-actions>

    <!-- Modal de imagen completa -->
    <div class="fullscreen-modal" *ngIf="fullscreenIndex !== -1" (click)="closeFullscreen()">
      <div class="fullscreen-content" (click)="$event.stopPropagation()">
        <button mat-icon-button class="close-fullscreen" (click)="closeFullscreen()">
          <mat-icon>close</mat-icon>
        </button>
        <img [src]="photos[fullscreenIndex]" class="fullscreen-image">
        <div class="image-counter">{{ fullscreenIndex + 1 }} / {{ photos.length }}</div>
        <button mat-icon-button class="nav-button prev" 
                (click)="previousImage()" 
                *ngIf="fullscreenIndex > 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button class="nav-button next" 
                (click)="nextImage()" 
                *ngIf="fullscreenIndex < photos.length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .evidence-info {
      margin-bottom: 24px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .evidence-info p {
      margin: 8px 0;
    }

    .tags {
      margin-top: 12px;
    }

    .photo-gallery {
      max-height: 70vh;
      overflow-y: auto;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .photo-card {
      cursor: pointer;
      transition: transform 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .photo-card:hover {
      transform: scale(1.02);
    }

    .gallery-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .photo-card:hover .photo-overlay {
      opacity: 1;
    }

    .photo-overlay mat-icon {
      color: white;
      font-size: 2rem;
    }

    /* Modal de pantalla completa */
    .fullscreen-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fullscreen-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }

    .fullscreen-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .close-fullscreen {
      position: absolute;
      top: -50px;
      right: 0;
      color: white;
    }

    .image-counter {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 1.2rem;
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: white;
      font-size: 2rem;
    }

    .nav-button.prev {
      left: -60px;
    }

    .nav-button.next {
      right: -60px;
    }

    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }

      .nav-button.prev {
        left: -40px;
      }

      .nav-button.next {
        right: -40px;
      }
    }
  `]
})
export class PhotoGalleryDialogComponent {
  evidence: any;
  photos: string[] = [];
  fullscreenIndex = -1;

  constructor(
    public dialogRef: MatDialogRef<PhotoGalleryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.evidence = data.evidence;
    this.photos = data.photos;
  }

  getCategoryLabel(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'before': 'Antes',
      'during': 'Durante',
      'after': 'Después',
      'incident': 'Incidente',
      'equipment': 'Equipo',
      'safety': 'Seguridad'
    };
    return categoryMap[category] || category;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openFullscreen(index: number): void {
    this.fullscreenIndex = index;
  }

  closeFullscreen(): void {
    this.fullscreenIndex = -1;
  }

  previousImage(): void {
    if (this.fullscreenIndex > 0) {
      this.fullscreenIndex--;
    }
  }

  nextImage(): void {
    if (this.fullscreenIndex < this.photos.length - 1) {
      this.fullscreenIndex++;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
