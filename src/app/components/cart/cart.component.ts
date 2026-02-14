import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { DiscountCodeService } from '../../services/discount-code.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  discountCode: string = '';
  resultMessage: string = '';
  isDiscountCodeVisible: boolean = false;
  isDiscountCodeValid: boolean | null = null;
  isDiscountCodeApplied: boolean = false;

  constructor(
    private cartService: CartService,
    private discountCodeService: DiscountCodeService
  ) {}

  ngOnInit(): void {
    this.cartService.getItems().subscribe((items) => (this.cartItems = items));
    this.cartService.getTotalAmount().subscribe((amount) => (this.totalAmount = amount));
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  incrementQuantity(item: CartItem) {
    item.quantity += 1;
    this.cartService.updateItem(item);
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(item);
    }
  }


  applyDiscountCode() {
    if (this.isDiscountCodeApplied) return;
    this.resultMessage = '';

    // Uwaga: przekaż SUBTOTAL a nie total po rabacie (żeby procent liczył się od wartości koszyka)
    let currentSubtotal = 0;
    const sub = this.cartService.getSubtotal().subscribe(v => currentSubtotal = v);
    sub.unsubscribe();

    this.discountCodeService.validateDiscountCode(this.discountCode, currentSubtotal).subscribe({
      next: (response) => {
        this.isDiscountCodeValid = response.valid;
        if (response.valid) {
          this.isDiscountCodeApplied = true;

          const type = (response.discountType || '').toUpperCase() as 'PERCENTAGE' | 'FIXED';
          const value = Number(response.discountValue) || 0;

          // zapisz rabat w źródle prawdy
          this.cartService.applyDiscount(this.discountCode, type, value);

          this.resultMessage = response.message || 'cart.successMessageDiscountCode';
        } else {
          this.resultMessage = response.message || 'cart.errorMessageDiscountCode';
        }
      },
      error: () => {
        this.isDiscountCodeValid = false;
        this.resultMessage = 'cart.errorMessageDiscountCode';
      }
    });
  }

  showDiscountCode() {
    this.isDiscountCodeVisible = !this.isDiscountCodeVisible;
  }
}
