import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { PayuService } from '../../services/payu.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
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

  constructor(private router: Router, private cartService: CartService, private payuService: PayuService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      email: string,
      firstName: string,
      lastName: string,
      country: string,
      state: string,
      address: string,
      apartmentNumber: string,
      city: string,
      zip: string
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
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);
  }

  createOrderData() {
    const products = this.cartItems.map(item => ({
      name: item.productName,
      unitPrice: (item.price * 100).toString(),
      quantity: item.quantity.toString()
    }));
    const totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity * 100), 0).toString();

    return {
      description: this.cartItems.map(item => item.productName).join(' + '),
      currencyCode: 'PLN',
      totalAmount: totalAmount,
      extOrderId: 'abc' + Math.floor(Math.random() * 10000).toString(),
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      products: products
    };
  }

  proceedToPayment() {
    const orderData = this.createOrderData();
    this.payuService.initiatePayment(orderData).subscribe({
      next: (response) => {
        console.log(response); // Ensure you're logging the response, not the request data
        const redirectUri = response.redirectUri;
        if (redirectUri) {
          window.location.href = redirectUri;
        } else {
          alert('No redirect URL provided');
        }
      },
      error: (error) => {
        console.error('Payment initiation error:', error);
        alert('Przepraszamy, płatność niedostępna - spróbuj później');
      }
    });
  }
}
