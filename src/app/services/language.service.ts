import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

type Lang = 'pl' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'app.lang';
  private readonly defaultLang: Lang = 'pl';
  private readonly supported: Lang[] = ['pl', 'en'];

  private currentLangSubject = new BehaviorSubject<Lang>(this.defaultLang);
  readonly currentLang$ = this.currentLangSubject.asObservable();

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translate.addLangs(this.supported);
    this.translate.setDefaultLang(this.defaultLang);

    const saved = this.readSavedLang();
    const browser = this.normalize(this.translate.getBrowserLang());
    const initial = (saved ?? browser ?? this.defaultLang) as Lang;

    this.setLanguage(initial);
  }

  get currentLang(): Lang {
    return this.currentLangSubject.value;
  }

  toggle(): void {
    const next: Lang = this.currentLang === 'pl' ? 'en' : 'pl';
    this.setLanguage(next);
  }

  setLanguage(lang: Lang): void {
    if (!this.supported.includes(lang)) lang = this.defaultLang;
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    this.document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(this.storageKey, lang);
  }

  private readSavedLang(): Lang | null {
    const val = localStorage.getItem(this.storageKey);
    return this.normalize(val);
  }

  private normalize(val: string | null | undefined): Lang | null {
    if (!val) return null;
    const short = val.slice(0, 2).toLowerCase();
    return (this.supported as string[]).includes(short) ? (short as Lang) : null;
  }
}