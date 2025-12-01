import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private location: Location,
    private localStorageService: LocalStorageService
  ) {}

  @Output() toggleSidebar = new EventEmitter<void>();

  previousEndpoint: string = '/';
  enter: boolean = true;

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onProfile() {
    if (this.enter) {
      const currentUrl = this.location.path();
      this.previousEndpoint = currentUrl.split('?')[0];
      this.router.navigate(['/petrotask/profile']);
      this.enter = false;
    } else {
      this.router.navigate([this.previousEndpoint]);
      this.enter = true;
    }
  }

  onLogout(): void {
    // Limpiar todos los datos del localStorage
    this.localStorageService.clear();

    // Navegar de vuelta al login
    this.router.navigate(['/login']);
  }
}
