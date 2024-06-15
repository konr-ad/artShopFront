import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Painting } from './painting.service';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string; // Add imageUrl to handle painting images
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalAmountSubject = new BehaviorSubject<number>(0);

  getItems() {
    return this.itemsSubject.asObservable();
  }

  getTotalAmount() {
    return this.totalAmountSubject.asObservable();
  }

  private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  addItem(painting: Painting) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(i => i.productId === painting.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        productId: painting.id!,
        productName: painting.name,
        price: painting.price,
        quantity: 1,
        imageUrl: painting.imageUrl
      };
      currentItems.push(newItem);
    }
    this.itemsSubject.next(currentItems);
    this.totalAmountSubject.next(this.calculateTotalAmount(currentItems));
  }

  updateItem(item: CartItem) {
    const currentItems = this.itemsSubject.value;
    const index = currentItems.findIndex(i => i.productId === item.productId);
    if (index > -1) {
      currentItems[index] = item;
      this.itemsSubject.next(currentItems);
      this.totalAmountSubject.next(this.calculateTotalAmount(currentItems));
    }
  }

  removeItem(productId: number) {
    let currentItems = this.itemsSubject.value;
    currentItems = currentItems.filter(item => item.productId !== productId);
    this.itemsSubject.next(currentItems);
    this.totalAmountSubject.next(this.calculateTotalAmount(currentItems));
  }
}
