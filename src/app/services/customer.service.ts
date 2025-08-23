import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config/ConfigService";

export interface Customer {
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
  providedIn: 'root'
})
export class CustomerService {
  private backendUrl :string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/paintings';
  }
}
