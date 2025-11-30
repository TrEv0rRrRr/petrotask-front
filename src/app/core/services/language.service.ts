import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'preferredLanguage';
  private readonly defaultLang = 'en';
  private readonly supportedLangs = ['en', 'es'];

  constructor(private translate: TranslateService) {
    const storedLang = localStorage.getItem(this.STORAGE_KEY);
    const lang = storedLang && this.supportedLangs.includes(storedLang)
      ? storedLang
      : this.defaultLang;
    this.setLanguage(lang);
  }

  get currentLang(): string {
    return this.translate.currentLang || this.defaultLang;
  }

  get supportedLanguages(): string[] {
    return this.supportedLangs;
  }

  setLanguage(lang: string) {
    if (this.supportedLangs.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }
} 