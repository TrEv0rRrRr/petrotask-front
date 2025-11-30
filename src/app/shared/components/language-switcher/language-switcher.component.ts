import { Component, OnInit, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { LanguageService } from 'src/app/core/services/language.service';
import { UiService } from 'src/app/core/services/ui.service';

interface Language {
  code: string;
  flag: string;
  short: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent implements OnInit {
  private uiService = inject(UiService);
  currentLang: string;
  languages: Language[] = [
    { code: 'en', flag: '🇺🇸', short: 'EN' },
    { code: 'es', flag: '🇪🇸', short: 'ES' }
  ];

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.currentLang;
  }

  ngOnInit() {
    this.currentLang = this.languageService.currentLang;
  }

  useLanguage(language: string) {
    this.languageService.setLanguage(language);
    this.currentLang = language;
    this.uiService.showSnackbar({
      message: 'Language changed to ' + language,
      type: 'success'
    });
  }
}
