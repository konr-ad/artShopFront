import {AfterViewInit, Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import { ViewportScroller } from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements AfterViewInit {
  effectiveDate = '2025-09-01';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scroller: ViewportScroller
  ) {}

  ngAfterViewInit() {
    setTimeout(() => this.scrollFromFragment(), 0);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.scrollFromFragment(), 0));
  }

  private scrollFromFragment() {
    const frag = this.route.snapshot.fragment;
    if (frag) this.scroller.scrollToAnchor(frag);
  }

  scrollTo(id: string, ev: Event) {
    ev.preventDefault();
    this.scroller.scrollToAnchor(id);
  }
}
