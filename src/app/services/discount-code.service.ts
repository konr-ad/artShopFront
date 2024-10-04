import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config/ConfigService";

export interface DiscountCodeResponse {
  valid: boolean;
  message: string;
  discountValue: number;
}
@Injectable({
  providedIn: 'root'
})
export class DiscountCodeService {
  private backendUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.backendUrl = configService.getConfig("API_URL") + "/api/discountcodes"
  }

  validateDiscountCode(code: string): Observable<DiscountCodeResponse> {
    const body = {
      code: code
    };
    console.log(body)
    return this.http.post<DiscountCodeResponse>(this.backendUrl + "/validate", body)
  }
}
