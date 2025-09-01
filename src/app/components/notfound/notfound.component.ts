import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css',
})
export class NotfoundComponent {}
