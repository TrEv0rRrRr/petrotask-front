import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-styles-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    RouterOutlet,
    MatAnchor,
    TranslatePipe,
  ],
  templateUrl: './styles-demo.component.html',
  styleUrls: ['./styles-demo.component.scss'],
})
export class StylesDemoComponent {
  title = 'petrotask-frontend';
  isDarkTheme = false;

  options = [
    { path: '/register', title: 'Register' },
    { path: '/account', title: 'Account' },
  ];

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
