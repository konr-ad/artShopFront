import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "./config/ConfigService";

@Injectable({
  providedIn: 'root'
})
export class PayuService {
  private backendUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/orders';
  }

  initiatePayment(orderData: any): Observable<any> {
    return this.http.post(this.backendUrl, orderData);
  }
}
