import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css',
})
export class ThankyouComponent implements OnInit {
  orderId?: string | null;
  email?: string | null;

  constructor(private route: ActivatedRoute, private cart: CartService) {}

  ngOnInit(): void {
    // 1) próba z query paramów (np. .../thankyou?orderId=123&email=foo@bar)
    this.route.queryParamMap.subscribe(params => {
      this.orderId = params.get('orderId') ?? this.orderId;
      this.email   = params.get('email')   ?? this.email;
    });

    // 2) fallback z history.state (jeśli wrócisz z własnego redirectu)
    const st = history.state as { orderId?: string; email?: string } | undefined;
    if (st) {
      this.orderId = this.orderId ?? st.orderId ?? null;
      this.email   = this.email   ?? st.email   ?? null;
      this.maybeClearCart();
    }

    // 3) ostatnia deska ratunku: sessionStorage (zapisz to po utworzeniu zamówienia)
    if (!this.orderId) this.orderId = sessionStorage.getItem('lastOrderId');
    if (!this.email)   this.email   = sessionStorage.getItem('lastOrderEmail');
    this.maybeClearCart();
  }

  private maybeClearCart() {
    // czyść tylko raz dla danego orderId (albo bez warunku – jeśli wolisz)
    const key = 'cartClearedFor';
    const already = sessionStorage.getItem(key);
    const id = this.orderId ?? 'unknown';

    if (already !== id) {
      this.cart.clearCart();                 // czyści BehaviorSubjecty i 'cartItems'
      sessionStorage.setItem(key, id);       // znacznik, żeby nie robić tego wielokrotnie
      // opcjonalnie posprzątaj pomocnicze klucze:
      sessionStorage.removeItem('lastOrderId');
      sessionStorage.removeItem('lastOrderEmail');
    }
  }
}
