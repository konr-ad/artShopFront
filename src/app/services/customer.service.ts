import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { ConfigService } from './config/ConfigService';
import {Page} from "./painting.service";
import {AdminOrderDto} from "./order.service";

export interface CustomerDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  address: string;
  apartmentNumber: string;
  city: string;
  zip: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiBase = this.configService.getConfig('API_URL');
  private adminUrl  = `${this.apiBase}/api/admin/customers`;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  getCustomers(page = 0, size = 20) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<CustomerDto>>(this.adminUrl, { params });
  }

  getCustomer(id: number) {
    return this.http.get<CustomerDto>(`${this.adminUrl}/${id}`);
  }

  getCustomerOrders(customerId: number, page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<AdminOrderDto>>(`${this.adminUrl}/${customerId}/orders`, { params });
  }
}
