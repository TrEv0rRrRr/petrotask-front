import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SnackbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'petrotask-frontend';
  isDarkTheme = false;

  // Use inject() for services
  private themeService = inject(ThemeService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  constructor() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    // LanguageService is now initialized globally
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

