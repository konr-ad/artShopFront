import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { Painting } from 'src/app/services/painting.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  isDiscountApplied: boolean = false;
  promoCode: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);
  }

  addItem(painting: Painting) {
    this.cartService.addItem(painting);
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

  applyDiscount() {
    if (!this.isDiscountApplied) {
      this.totalAmount -= this.totalAmount * 0.1; // Apply 10% discount
      this.isDiscountApplied = true;
    }
  }
}
