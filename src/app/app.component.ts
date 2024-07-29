import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  showHeader: boolean = true;
  title = 'paintings-app';

  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noHeaderRoutes = ['/login', '/admin'];
        this.showHeader = !noHeaderRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
