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
        sessionStorage.setItem('lastOrderId', res.orderId);
        sessionStorage.setItem('lastOrderEmail', this.email);
        this.redirectUri = res.redirectUri;
        if (!this.redirectUri) {
          alert('Brak adresu przekierowania');
        }
      },
      error: () => {
        alert('Przepraszamy, płatność niedostępna - spróbuj później');
      },
    });
  }
}
