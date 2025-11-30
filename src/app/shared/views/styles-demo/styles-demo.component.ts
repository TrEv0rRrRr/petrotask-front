import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatAnchor, MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {SelectorComponent} from '../../../shared/components/selector/selector.component';
import {InputComponent} from '../../../shared/components/input/input.component';
import {RegisterComponent} from '../../../core/registration/views/register/register.component';
import {AccountCreationComponent} from '../../../core/registration/views/account-creation/account-creation.component';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';

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
    ButtonComponent,
    SelectorComponent,
    InputComponent,
    RegisterComponent,
    AccountCreationComponent,
    TranslatePipe
  ],
  templateUrl: './styles-demo.component.html',
  styleUrls: ['./styles-demo.component.scss']
})
export class StylesDemoComponent {
  title = 'petrotask-frontend';
  isDarkTheme = false;

  options = [
    { path: '/register', title: 'Register' },
    { path:'/account', title: 'Account' }
  ]


  constructor(private themeService: ThemeService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}
