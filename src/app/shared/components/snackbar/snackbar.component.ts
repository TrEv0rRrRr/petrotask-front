import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UiService, SnackbarData } from 'src/app/core/services/ui.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  type: 'success' | 'error' | 'info' | 'warning' = 'info';
  duration = 3000;
  progress = 100;
  private timer: any;
  private sub?: Subscription;

  constructor(private uiService: UiService) {
    
  }

  ngOnInit() {
    this.sub = this.uiService.snackbar$.subscribe((data: SnackbarData | null) => {
      if (data) {
        this.message = data.message;
        this.type = data.type || 'info';
        this.duration = data.duration || 3000;
        this.show();
      } else {
        this.hide();
      }
    });
  }

  show() {
    this.visible = true;
    this.progress = 100;
    if (this.timer) clearInterval(this.timer);
    const interval = 10;
    const decrement = 100 / (this.duration / interval);
    this.timer = setInterval(() => {
      this.progress -= decrement;
      if (this.progress <= 0) {
        this.progress = 0;
        this.hide();
      }
    }, interval);
    setTimeout(() => this.hide(), this.duration);
  }

  hide() {
    this.visible = false;
    if (this.timer) clearInterval(this.timer);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.timer) clearInterval(this.timer);
  }
}
