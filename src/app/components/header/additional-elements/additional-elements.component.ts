import { Component } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-additional-elements',
  templateUrl: './additional-elements.component.html',
  styleUrls: ['./additional-elements.component.scss']
})
export class AdditionalElementsComponent {
  constructor(public lang: LanguageService) {}

  toggleLang(): void {
    this.lang.toggle();
  }

  get switchLabel(): string {
    return this.lang.currentLang === 'pl' ? 'EN' : 'PL';
  }
}