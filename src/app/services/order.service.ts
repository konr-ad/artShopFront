import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "./config/ConfigService";
import {Painting} from "./painting.service";
import {Customer} from "./customer.service";

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
  customer: Customer;
  paintings: Painting[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private backendUrl: string;


  constructor(private http: HttpClient, private configService: ConfigService) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/orders';
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.backendUrl);
  }
}
