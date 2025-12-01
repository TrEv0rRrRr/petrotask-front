import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoGalleryDialogComponent } from './photo-gallery-dialog.component';
import { PhotoUploadDialogComponent } from './photo-upload-dialog.component';

interface PhotoEvidence {
  id: string;
  title: string;
  description: string;
  category: 'before' | 'during' | 'after' | 'incident' | 'equipment' | 'safety';
  location: string;
  timestamp: Date;
  photos: string[];
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
}

@Component({
  selector: 'app-photo-evidence',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './photo-evidence.component.html',
  styleUrls: ['./photo-evidence.component.scss'],
})
export class PhotoEvidenceComponent implements OnInit {
  currentTab = 0;

  // Evidencias fotográficas existentes
  photoEvidences: PhotoEvidence[] = [];

  // Categorías disponibles
  categories = [
    { value: 'before', label: 'Antes', icon: 'schedule', color: 'primary' },
    { value: 'during', label: 'Durante', icon: 'play_arrow', color: 'accent' },
    {
      value: 'after',
      label: 'Después',
      icon: 'check_circle',
      color: 'primary',
    },
    { value: 'incident', label: 'Incidente', icon: 'warning', color: 'warn' },
    { value: 'equipment', label: 'Equipo', icon: 'build', color: 'accent' },
    { value: 'safety', label: 'Seguridad', icon: 'security', color: 'primary' },
  ];

  // Estadísticas
  totalPhotos = 0;
  pendingApproval = 0;
  approvedPhotos = 0;

  // Propiedades para subida de fotos
  selectedFiles: File[] = [];
  photoPreviews: string[] = [];
  isUploading = false;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalPhotos = this.photoEvidences.reduce(
      (total, evidence) => total + evidence.photos.length,
      0
    );
    this.pendingApproval = this.photoEvidences.filter(
      (e) => e.status === 'pending'
    ).length;
    this.approvedPhotos = this.photoEvidences.filter(
      (e) => e.status === 'approved'
    ).length;
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find((c) => c.value === category);
    return cat ? cat.icon : 'help';
  }

  getCategoryColor(category: string): string {
    const cat = this.categories.find((c) => c.value === category);
    return cat ? cat.color : '';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'accent';
      case 'approved':
        return 'primary';
      case 'rejected':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'approved':
        return 'check_circle';
      case 'rejected':
        return 'cancel';
      default:
        return 'help';
    }
  }

  approveEvidence(evidence: PhotoEvidence): void {
    evidence.status = 'approved';
    this.calculateStatistics();
    console.log('Evidencia aprobada:', evidence.title);
  }

  rejectEvidence(evidence: PhotoEvidence): void {
    evidence.status = 'rejected';
    this.calculateStatistics();
    console.log('Evidencia rechazada:', evidence.title);
  }

  getFilteredEvidences(category?: string): PhotoEvidence[] {
    if (!category) return this.photoEvidences;
    return this.photoEvidences.filter((e) => e.category === category);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Métodos para subida de fotos
  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.createPreviews();
    }
  }

  createPreviews(): void {
    this.photoPreviews = [];
    this.selectedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(PhotoUploadDialogComponent, {
      width: '600px',
      data: {
        categories: this.categories,
        selectedFiles: this.selectedFiles,
        photoPreviews: this.photoPreviews,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uploadPhotos(result);
      }
    });
  }

  uploadPhotos(uploadData: any): void {
    this.isUploading = true;

    // Simular subida (en producción sería una llamada HTTP)
    setTimeout(() => {
      const newEvidence: PhotoEvidence = {
        id: Date.now().toString(),
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        location: uploadData.location,
        timestamp: new Date(),
        photos: this.photoPreviews,
        uploadedBy: 'Usuario Actual', // En producción sería el usuario logueado
        status: 'pending',
        tags: uploadData.tags || [],
      };

      this.photoEvidences.unshift(newEvidence);
      this.calculateStatistics();
      this.clearUploadData();
      this.isUploading = false;

      this.snackBar.open('Fotos subidas exitosamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }, 2000);
  }

  clearUploadData(): void {
    this.selectedFiles = [];
    this.photoPreviews = [];
  }

  viewPhotos(evidence: PhotoEvidence): void {
    this.dialog.open(PhotoGalleryDialogComponent, {
      width: '90vw',
      maxWidth: '1200px',
      data: {
        evidence: evidence,
        photos: evidence.photos,
      },
    });
  }
}
