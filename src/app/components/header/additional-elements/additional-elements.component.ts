import {Component, inject} from '@angular/core';
import { LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-additional-elements',
  templateUrl: './additional-elements.component.html',
  styleUrls: ['./additional-elements.component.css'],
})
export class AdditionalElementsComponent {
  lang: LanguageService = inject(LanguageService);
}
