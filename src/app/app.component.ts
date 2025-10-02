import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  trigger, transition, style, animate, query, group
} from '@angular/animations';
import { LanguageService } from './services/language.service';
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnim', [
      transition('* <=> *', [
        query(':enter', [ style({ opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)' }) ], { optional: true }),
        group([
          query(':leave', [ animate('150ms ease-out', style({ opacity: 0, transform: 'translateY(-6px)', filter: 'blur(2px)' })) ], { optional: true }),
          query(':enter', [ animate('250ms ease-out', style({ opacity: 1, transform: 'none', filter: 'none' })) ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  showHeader = true;
  showFooter = true;
  title = 'Bialkowskaismail.';
  routerUrl = '';

  constructor(private router: Router, private lang: LanguageService) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.routerUrl = e.urlAfterRedirects || e.url || '';
        const noHeaderFooterRoutes = ['/login', '/admin'];
        const isAdminRoute =
          this.routerUrl.startsWith('/admin') || this.routerUrl.startsWith('/login');

        this.showHeader = !noHeaderFooterRoutes.some((r) => this.routerUrl.startsWith(r));
        this.showFooter = !isAdminRoute;
      });
  }
}
