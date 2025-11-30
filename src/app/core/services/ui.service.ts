import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackbarData {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  private snackbarSubject = new BehaviorSubject<SnackbarData | null>(null);
  snackbar$ = this.snackbarSubject.asObservable();

  showSnackbar(data: SnackbarData) {
    this.snackbarSubject.next(data);
  }

  hideSnackbar() {
    this.snackbarSubject.next(null);
  }
}



