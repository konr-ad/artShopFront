import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  quantities = Array.from({ length: 8 }, (_, i) => i + 1); // Array [1,2,3,4,5,6,7,8]

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  updateItem(item: CartItem) {
    this.cartService.updateItem(item);
  }
}
