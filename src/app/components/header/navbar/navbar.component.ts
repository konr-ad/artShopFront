import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  menuOpen: boolean = false;

  constructor(private cartService: CartService, private router: Router, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cartService.getItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  navigateWithFilters(type: string): void {
    this.router.navigate(['/shop'], { queryParams: { type } }).then(() => {
      this.closeDropdown();
    });
  }

  closeDropdown(): void {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      dropdown.classList.add('hidden');
    });
    this.menuOpen = false;
    this.changeDetector.detectChanges();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;  // Toggle the mobile menu open state
    this.changeDetector.detectChanges();
    console.log('Menu toggled:', this.menuOpen);
  }
}
