import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { filter } from 'rxjs/operators';
import {AuthService} from "../../../services/AuthService";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0;
  menuOpen = false;
  mobile = { shop: false, about: false };

  // desktop dropdown state + timery zamykania
  openShop = false;
  openAbout = false;
  private closeTimerShop?: any;
  private closeTimerAbout?: any;
  private readonly CLOSE_DELAY = 180; // ms

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.getItemCount().subscribe(count => this.cartItemCount = count);

    // zamykaj panel mobilny po nawigacji
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.menuOpen = false;
      this.mobile = { shop: false, about: false };
      this.cdr.markForCheck();
    });
  }

  // --- outside click + Esc (desktop dropdowny)
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.el.nativeElement.contains(ev.target as Node)) this.closeAllDesktop();
  }
  @HostListener('document:keydown.escape')
  onEsc() { this.closeAllDesktop(); }

  private closeAllDesktop() {
    this.openShop = false;
    this.openAbout = false;
    if (this.closeTimerShop) clearTimeout(this.closeTimerShop);
    if (this.closeTimerAbout) clearTimeout(this.closeTimerAbout);
  }

  // --- hover enter/leave z lekkim opóźnieniem
  enter(which: 'shop'|'about') {
    if (which === 'shop') {
      if (this.closeTimerShop) clearTimeout(this.closeTimerShop);
      this.openShop = true;
    } else {
      if (this.closeTimerAbout) clearTimeout(this.closeTimerAbout);
      this.openAbout = true;
    }
  }
  leave(which: 'shop'|'about') {
    if (which === 'shop') {
      this.closeTimerShop = setTimeout(() => this.openShop = false, this.CLOSE_DELAY);
    } else {
      this.closeTimerAbout = setTimeout(() => this.openAbout = false, this.CLOSE_DELAY);
    }
  }

  // mobile
  toggleMenu() { this.menuOpen = !this.menuOpen; }

  navigateWithFilters(type: string) {
    this.router.navigate(['/shop'], { queryParams: type ? { type } : {} }).then(() => {
      this.menuOpen = false;
      this.mobile = { shop: false, about: false };
      this.cdr.detectChanges();
    });
  }
}
