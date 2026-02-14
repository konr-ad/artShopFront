import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService, PublicOrderStatusDto } from '../../services/order.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

function isFinalStatus(s: string | null | undefined): boolean {
  return s === 'COMPLETED' || s === 'CANCELED' || s === 'ERROR';
}

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css',
})
export class ThankyouComponent implements OnInit, OnDestroy {
  orderId?: string | null;
  email?: string | null;

  loading = false;
  paymentStatus?: string | null;
  errorMessage?: string | null;

  private pollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = sessionStorage.getItem('lastOrderId');
    this.email   = sessionStorage.getItem('lastOrderEmail');

    if (!this.orderId) {
      this.errorMessage = 'Nie udało się odczytać numeru zamówienia.';
      return;
    }
    this.cart.clearCart();
    this.startPollingStatus(this.orderId);
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private startPollingStatus(extOrderId: string) {
    this.loading = true;

    this.pollSub = timer(0, 3000) // od razu (0), a potem co 7000 ms
      .pipe(
        switchMap(() => this.orderService.getPublicOrderStatus(extOrderId))
      )
      .subscribe({
        next: (res: PublicOrderStatusDto) => {
          this.paymentStatus = res.paymentStatus;
          this.loading = false;

          // np. czyszczenie koszyka przy kompletnym opłaceniu
          if (this.paymentStatus === 'COMPLETED') {
            this.cart.clearCart();
          }

          // jeśli status końcowy – przestajemy pytać
          if (isFinalStatus(this.paymentStatus)) {
            this.pollSub?.unsubscribe();
          }
        },
        error: err => {
          console.error('Order status error', err);
          this.loading = false;
          this.errorMessage = 'Nie udało się pobrać statusu zamówienia.';
          this.pollSub?.unsubscribe();
        }
      });
  }
}
