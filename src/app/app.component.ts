import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  showHeader: boolean = true;
  showFooter: boolean = true;
  title = 'paintings-app';

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noHeaderFooterRoutes = ['/login', '/admin'];
        const isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
        this.showHeader = !noHeaderFooterRoutes.some(route =>
          event.urlAfterRedirects.startsWith(route)
        );
        this.showFooter = !isAdminRoute;
      }
    });
  }
}
