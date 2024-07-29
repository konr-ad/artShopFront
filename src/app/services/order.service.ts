import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService{

  private backendUrl = 'http://25.53.71.208:8080/api/orders'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(this.backendUrl);
  }

}
