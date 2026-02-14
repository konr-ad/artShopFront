import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { PaintingType } from 'src/app/services/painting.service';
import {ModalService} from "./modal/modal-service.service";

export interface CartItem {
  productId: number;
  productName: string;
  price: number;           // cena jednostkowa
  quantity: number;
  imageUrl?: string;
  type: PaintingType;
}

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface DiscountState {
  code: string;
  type: DiscountType;
  value: number;           // 10 => 10% lub 10 PLN (w zależności od type)
}

function isSingleQtyType(t: PaintingType): boolean {
  return t !== 'PRINT' && t !== 'DIGITAL';
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly ITEMS_KEY = 'cartItems';
  private readonly DISC_KEY  = 'cartDiscount';

  protected modalService: ModalService = inject(ModalService);
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.load<CartItem[]>(this.ITEMS_KEY, []));
  private discountSubject = new BehaviorSubject<DiscountState | null>(this.load<DiscountState | null>(this.DISC_KEY, null));

  // Ilość sztuk
  private itemCountSubject = new BehaviorSubject<number>(this.calculateItemCount(this.itemsSubject.value));

  /** Subtotal (bez rabatu) */
  readonly subtotal$ = this.itemsSubject.pipe(
    map(items => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  /** Kwota rabatu (nigdy > subtotal) */
  readonly discountAmount$ = combineLatest([this.subtotal$, this.discountSubject]).pipe(
    map(([subtotal, d]) => {
      if (!d || subtotal <= 0) return 0;
      if (d.type === 'PERCENTAGE') return Math.min(subtotal, (subtotal * d.value) / 100);
      return Math.min(subtotal, d.value);
    })
  );

  /** Total po rabacie */
  readonly total$ = combineLatest([this.subtotal$, this.discountAmount$]).pipe(
    map(([subtotal, disc]) => Math.max(0, subtotal - disc))
  );

  // --- public API zgodne z Twoim kodem ---
  getItems()         { return this.itemsSubject.asObservable(); }
  getItemCount()     { return this.itemCountSubject.asObservable(); }
  getTotalAmount()   { return this.total$; }                    // UWAGA: teraz to total po rabacie
  getSubtotal()      { return this.subtotal$; }                 // pomocnicze do UI/validacji kodu
  getDiscountAmount(){ return this.discountAmount$; }           // pomocnicze do UI
  getDiscountState() { return this.discountSubject.asObservable(); }

  addItem(p: { id: number; name: string; price: number; imageUrl?: string | null; type: PaintingType }) {
    const items = [...this.itemsSubject.value];
    const existing = items.find(i => i.productId === p.id /* jeśli w systemie ten sam produkt może mieć różne type,
                                                            rozważ także && i.type === p.type */);

    if (existing) {
      if (isSingleQtyType(existing.type)) {
      } else {
        existing.quantity += 1;
      }
    } else {
      const qty = isSingleQtyType(p.type) ? 1 : 1;
      items.push({
        productId: p.id,
        productName: p.name,
        price: p.price,
        quantity: qty,
        imageUrl: p.imageUrl ?? undefined,
        type: p.type,
      });
    }

    this.updateItems(items);
    this.modalService.open('ADD_TO_CART', {
      title: p.name,
      price: p.price,
      imgUrl: p.imageUrl,
      quantity: 1,
    })
  }

  updateItem(item: CartItem) {
    const items = this.itemsSubject.value.map(x => {
      if (x.productId !== item.productId /* && x.type !== item.type (jeśli rozróżniasz po typie) */) return x;

      const clampedQty = isSingleQtyType(item.type) ? 1 : Math.max(1, item.quantity);
      return { ...item, quantity: clampedQty };
    });

    this.updateItems(items);
  }

  removeItem(productId: number) {
    const items = this.itemsSubject.value.filter(i => i.productId !== productId);
    this.updateItems(items);
  }

  clearCart() {
    this.updateItems([]);
    this.clearDiscount();
  }

  /** Zastosuj rabat (ustawia źródło prawdy) */
  applyDiscount(code: string, type: DiscountType, value: number) {
    const d: DiscountState = { code, type, value };
    this.discountSubject.next(d);
    this.save(this.DISC_KEY, d);
  }

  /** Usuń rabat */
  clearDiscount() {
    this.discountSubject.next(null);
    this.save(this.DISC_KEY, null);
  }

  // --- prywatne ---
  private updateItems(items: CartItem[]) {
    this.itemsSubject.next(items);
    this.itemCountSubject.next(this.calculateItemCount(items));
    this.save(this.ITEMS_KEY, items);
  }

  private calculateItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  private save(key: string, val: unknown) {
    sessionStorage.setItem(key, JSON.stringify(val));
  }
  private load<T>(key: string, fallback: T): T {
    try { const raw = sessionStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; }
    catch { return fallback; }
  }

  canAddMore(productId: number, type: PaintingType): boolean {
    if (isSingleQtyType(type)) {
      const found = this.itemsSubject.value.find(i => i.productId === productId /* && i.type === type */);
      return !found;
    }
    return true;
  }
}
