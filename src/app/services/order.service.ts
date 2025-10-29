import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config/ConfigService';
import {MediaFileDto, Painting} from './painting.service';
import { CustomerDto } from './customer.service';

export interface Order {
  id: number;
  description: string;
  currencyCode: string;
  totalAmount: string;
  extOrderId: string;
  paymentStatus: string;
  redirectUri: string;
  payuOrderId: string;
  creationDate: string;
  customer: CustomerDto;
  paintings: Painting[];
}

export interface OrderItem {
  paintingId: number;
  paintingName: string;
  paintingType: string;
  quantity: number;
  unitPriceAtPurchase: number;
  lineTotal: number;
}

export interface AdminOrderDto {
  id: number;
  paymentStatus: string;
  totalAmount: number;
  currencyCode: string;
  contactEmail: string;
  createdAt: string;
  shippingAddress: ShippingAddressDto;
  items: OrderItem[];
  customer: CustomerDto;
}

export interface ShippingAddressDto {
  street: string;
  apartmentNumber: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private backendUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/orders';
  }

  getOrders(): Observable<AdminOrderDto[]> {
    return this.http.get<AdminOrderDto[]>(this.backendUrl);
  }
}
