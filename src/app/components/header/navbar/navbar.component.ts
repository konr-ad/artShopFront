import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0;
  menuOpen = false;
  mobile = { shop: false, about: false };

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateWithFilters(type: string) {
    this.router.navigate(['/shop'], { queryParams: type ? { type } : {} }).then(() => {
      this.menuOpen = false;
      this.mobile = { shop: false, about: false };
      this.cdr.detectChanges();
    });
  }
}
