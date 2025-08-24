// src/app/core/language.service.ts
import { Injectable, inject, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type Lang = 'en' | 'pl';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const saved = (localStorage.getItem('lang') as Lang | null);
    const browser: Lang = navigator.language?.startsWith('pl') ? 'pl' : 'en';
    this.use(saved || browser);
  }

  use(lang: Lang) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.renderer.setAttribute(document.documentElement, 'lang', lang);
  }

  current(): Lang {
    return (this.translate.currentLang as Lang) || 'en';
  }

  toggle() {
    this.use(this.current() === 'en' ? 'pl' : 'en');
  }
}
