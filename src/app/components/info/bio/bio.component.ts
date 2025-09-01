import { Component } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.css',
})
export class BioComponent {
}
