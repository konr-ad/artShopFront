import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayuService {
  private backendUrl = 'http://25.53.71.208:8080/api/orders';

  constructor(private http: HttpClient) {}

  initiatePayment(orderData: any): Observable<any> {
    return this.http.post(this.backendUrl, orderData);
  }
}
