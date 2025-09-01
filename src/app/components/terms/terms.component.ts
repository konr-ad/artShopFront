import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  effectiveDate = '2025-09-01';

}
