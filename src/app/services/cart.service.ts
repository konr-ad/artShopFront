import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Painting } from 'src/app/services/painting.service';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartItems());
  private totalAmountSubject = new BehaviorSubject<number>(
    this.calculateTotalAmount(this.itemsSubject.value)
  );
  private itemCountSubject = new BehaviorSubject<number>(
    this.calculateItemCount(this.itemsSubject.value)
  );

  getItems() {
    return this.itemsSubject.asObservable();
  }

  getTotalAmount() {
    return this.totalAmountSubject.asObservable();
  }

  getItemCount() {
    return this.itemCountSubject.asObservable();
  }

  private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private calculateItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCartItems(items: CartItem[]) {
    sessionStorage.setItem('cartItems', JSON.stringify(items));
  }

  private loadCartItems(): CartItem[] {
    const savedItems = sessionStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  }

  addItem(p: { id: number; name: string; price: number; imageUrl?: string | null }) {
    const items = [...this.itemsSubject.value];

    const existing = items.find(i => i.productId === p.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      const newItem: CartItem = {
        productId: p.id,
        productName: p.name,
        price: p.price,
        quantity: 1,
        imageUrl: p.imageUrl ?? undefined
      };
      items.push(newItem);
    }

    this.itemsSubject.next(items);
    this.totalAmountSubject.next(this.calculateTotalAmount(items));
    this.itemCountSubject.next(this.calculateItemCount(items));
    this.saveCartItems(items);
  }

  updateItem(item: CartItem) {
    const currentItems = this.itemsSubject.value;
    const index = currentItems.findIndex((i) => i.productId === item.productId);
    if (index > -1) {
      currentItems[index] = item;
      this.itemsSubject.next(currentItems);
      this.totalAmountSubject.next(this.calculateTotalAmount(currentItems));
      this.itemCountSubject.next(this.calculateItemCount(currentItems));
      this.saveCartItems(currentItems);
    }
  }

  removeItem(productId: number) {
    let currentItems = this.itemsSubject.value;
    currentItems = currentItems.filter((item) => item.productId !== productId);
    this.itemsSubject.next(currentItems);
    this.totalAmountSubject.next(this.calculateTotalAmount(currentItems));
    this.itemCountSubject.next(this.calculateItemCount(currentItems));
    this.saveCartItems(currentItems);
  }
}
