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

    this.discountCodeService.validateDiscountCode(this.discountCode, this.totalAmount)
      .subscribe({
        next: (response) => {
          this.isDiscountCodeValid = response.valid;

          if (response.valid) {
            this.isDiscountCodeApplied = true;

            const discountValue = Number(response.discountValue) || 0;
            const discountType = response.discountType?.toUpperCase();

            let discountAmount = 0;

            if (discountType === 'PERCENTAGE') {
              discountAmount = (this.totalAmount * discountValue) / 100;
            } else if (discountType === 'FIXED') {
              discountAmount = discountValue;
            }

            // Nie pozwól zejść poniżej zera
            this.totalAmount = Math.max(0, this.totalAmount - discountAmount);

            this.resultMessage = response.message || 'Kod rabatowy został zastosowany.';
          } else {
            this.resultMessage = response.message || 'Nieprawidłowy kod rabatowy.';
          }
        },
        error: () => {
          this.isDiscountCodeValid = false;
          this.resultMessage = 'Wystąpił błąd podczas weryfikacji kodu rabatowego.';
        }
      });
  }

  showDiscountCode() {
    this.isDiscountCodeVisible = !this.isDiscountCodeVisible;
  }
}
