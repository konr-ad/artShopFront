import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { PayuService } from '../../services/payu.service';
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  address: string;
  apartmentNumber: string;
  city: string;
  zip: string;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  redirectUri?: string;
  showRedirectModal = false;
  redirectIn = 5;
  private countdownHandle?: number;
  private autoRedirectHandle?: number;
  private hasRedirected = false;
  private subtotal = 0;
  private discountAmount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private payuService: PayuService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      email: string;
      firstName: string;
      lastName: string;
      country: string;
      state: string;
      address: string;
      apartmentNumber: string;
      city: string;
      zip: string;
    };
    this.email = state?.email || '';
    this.firstName = state?.firstName || '';
    this.lastName = state?.lastName || '';
    this.country = state?.country || '';
    this.state = state?.state || '';
    this.address = state?.address || '';
    this.apartmentNumber = state?.apartmentNumber || '';
    this.city = state?.city || '';
    this.zip = state?.zip || '';
  }


  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(total => this.totalAmount = total);      // total po rabacie
    this.cartService.getSubtotal().subscribe(s => this.subtotal = s);                    // przed rabatem
    this.cartService.getDiscountAmount().subscribe(d => this.discountAmount = d);        // kwota rabatu
  }

  createOrderData() {
    const products = this.buildDiscountedProducts(this.cartItems, this.subtotal, this.discountAmount);

    return {
      description: this.cartItems.map(i => i.productName).join(' + '),
      currencyCode: 'PLN',
      extOrderId: 'abc' + Date.now(),
      contactEmail: this.email,
      buyer: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
      },
      shippingAddress: {
        street: this.address,
        apartmentNumber: this.apartmentNumber,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country
      },
      products,
      totals: {
        subtotal: this.round2(this.subtotal),
        discount: this.round2(this.discountAmount),
        total:    this.round2(this.totalAmount)
      },
      // (opcjonalnie – jeśli chcesz przekazać kod rabatowy do backendu)
      discount: this.buildDiscountMeta()
    };
  }

  private async buildDiscountMeta() {
    let code = '';
    const d = await firstValueFrom(this.cartService.getDiscountState());
    if (d) code = d.code;
    return code ? { code } : undefined;
  }

  proceedToPayment() {
    const orderData = this.createOrderData();
    this.payuService.initiatePayment(orderData).subscribe({
      next: (res) => {
        this.redirectUri = res?.redirectUri;
        if (res?.orderId) sessionStorage.setItem('lastOrderId', res.orderId);
        if (this.email)    sessionStorage.setItem('lastOrderEmail', this.email);

        if (this.redirectUri) {
          this.openRedirectModal();
        } else {
          alert('Brak adresu przekierowania');
        }
      },
      error: () => {
        alert('Przepraszamy, płatność niedostępna - spróbuj później');
      },
    });
  }

  private openRedirectModal() {
    this.showRedirectModal = true;
    this.redirectIn = 3;
    this.hasRedirected = false;

    // odliczanie widoczne w UI
    this.clearTimers();
    this.countdownHandle = window.setInterval(() => {
      this.redirectIn = Math.max(0, this.redirectIn - 1);
    }, 1000);

    // autoprzekierowanie po 3s
    this.autoRedirectHandle = window.setTimeout(() => {
      this.redirectToGateway();
    }, 3000);
  }

  private redirectToGateway() {
    if (this.hasRedirected || !this.redirectUri) return;
    this.hasRedirected = true;
    this.clearTimers();
    window.location.href = this.redirectUri;
  }

  cancelRedirect() {
    // opcjonalny „powrót”: po prostu chowamy modal
    this.clearTimers();
    this.showRedirectModal = false;
  }

  private clearTimers() {
    if (this.countdownHandle) {
      window.clearInterval(this.countdownHandle);
      this.countdownHandle = undefined;
    }
    if (this.autoRedirectHandle) {
      window.clearTimeout(this.autoRedirectHandle);
      this.autoRedirectHandle = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private round2(n: number): number {
    return Math.round(n * 100) / 100;
  }

  private buildDiscountedProducts(items: CartItem[], subtotal: number, discountAmount: number) {
    if (subtotal <= 0 || discountAmount <= 0) {
      // nic do korygowania
      return items.map(it => ({
        paintingId: it.productId,
        name: it.productName,
        paintingType: it.type,
        unitPrice: this.round2(it.price),   // bez zmian
        quantity: it.quantity
      }));
    }

    const totalBefore = this.round2(items.reduce((s, it) => s + it.price * it.quantity, 0));
    const totalAfter  = this.round2(Math.max(0, totalBefore - discountAmount));

    // proporcja udziału wartości pozycji w subtotalu
    const shares = items.map(it => (it.price * it.quantity) / subtotal);

    // obniż pozycje proporcjonalnie i pilnuj sumy (korekta na ostatniej pozycji)
    const out = items.map((it, idx) => {
      const part = this.round2(discountAmount * shares[idx]); // część rabatu dla pozycji
      const itemTotalAfter = this.round2(it.price * it.quantity - part);
      // aby uzyskać unitPrice po rabacie:
      const unitAfter = this.round2(itemTotalAfter / it.quantity);
      return {
        paintingId: it.productId,
        name: it.productName,
        paintingType: it.type,
        unitPrice: unitAfter,
        quantity: it.quantity
      };
    });

    // korekta sumy (różnice zaokrągleń)
    const sumOut = this.round2(out.reduce((s, p) => s + p.unitPrice * p.quantity, 0));
    const diff   = this.round2(totalAfter - sumOut);
    if (Math.abs(diff) >= 0.01) {
      // dorzuć różnicę do ostatniej pozycji (lub pierwszej, jak wolisz)
      const last = out[out.length - 1];
      out[out.length - 1] = {
        ...last,
        unitPrice: this.round2(last.unitPrice + diff / last.quantity)
      };
    }

    return out;
  }
}
