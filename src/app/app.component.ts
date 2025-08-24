import {Component, inject, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  showFooter: boolean = true;
  title = 'paintings-app';
  lang = inject(LanguageService);

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const noHeaderFooterRoutes = ['/login', '/admin'];
        const isAdminRoute =
          event.urlAfterRedirects.startsWith('/admin') ||
          event.urlAfterRedirects.startsWith('/login');
        this.showHeader = !noHeaderFooterRoutes.some((route) =>
          event.urlAfterRedirects.startsWith(route)
        );
        this.showFooter = !isAdminRoute;
      }
    });
  }
}
