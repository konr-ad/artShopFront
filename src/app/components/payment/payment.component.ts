import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { PayuService } from '../../services/payu.service';

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
    this.cartService.getItems().subscribe((items) => (this.cartItems = items));
    this.cartService.getTotalAmount().subscribe((amount) => (this.totalAmount = amount));
  }

  createOrderData() {
    const products = this.cartItems.map((item) => ({
      paintingId: item.productId,
      name: item.productName,
      paintingType: item.type,             // "OIL" | "MONOTYPE" | "PRINT"
      unitPrice: item.price,
      quantity: item.quantity
    }));

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
      products
    };
  }

  proceedToPayment() {
    const orderData = this.createOrderData();
    this.payuService.initiatePayment(orderData).subscribe({
      next: (res) => {
        this.redirectUri = res?.redirectUri;
        if (res?.orderId) sessionStorage.setItem('lastOrderId', res.orderId);
        if (this.email)    sessionStorage.setItem('lastOrderEmail', this.email);

        if (this.redirectUri) {
          this.openRedirectModal();     // <-- nowy modal + autoprzekierowanie
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
}
