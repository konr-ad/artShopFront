import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigService} from './config/ConfigService';
import {CustomerDto} from './customer.service';

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

export interface PublicOrderStatusDto {
  extOrderId: string;
  paymentStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private adminUrl: string;
  private publicUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.adminUrl = this.configService.getConfig('API_URL') + '/api/orders';
    this.publicUrl = this.configService.getConfig('API_URL') + '/api/public/orders';
  }

  getOrders(): Observable<AdminOrderDto[]> {
    return this.http.get<AdminOrderDto[]>(this.adminUrl);
  }

  getPublicOrderStatus(orderId: string): Observable<PublicOrderStatusDto> {
    return this.http.get<PublicOrderStatusDto>(
      `${this.publicUrl}/${orderId}/status`
    );
  }
}
