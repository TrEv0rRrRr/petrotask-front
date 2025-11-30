import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    LanguageSwitcherComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
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
      console.log("Endpoint de la ruta anterior:", this.previousEndpoint);
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
    
    console.log('Sesión cerrada exitosamente');
  }
}
