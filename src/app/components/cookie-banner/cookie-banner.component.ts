import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {translate} from "@angular/localize/tools";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent implements OnInit {

  isVisible = false;

  ngOnInit(): void {
    const accepted = localStorage.getItem('cookiesAccepted');
    this.isVisible = accepted !== 'true';
  }

  acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.isVisible = false;
  }
}
