import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config/ConfigService";
import {List} from "postcss/lib/list";

export interface DiscountCodeDto {
  id: number;
  code: string;
  valid: boolean;
  message: string;
  discountValue: number;
  discountType: string;
  minimumOrderValue: number;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
  validTo: Date;
  validFrom: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountCodeService {
  private backendUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.backendUrl = configService.getConfig("API_URL") + "/api/discountcodes"
  }

  validateDiscountCode(code: string): Observable<DiscountCodeDto> {
    const body = {
      code: code
    };
    return this.http.post<DiscountCodeDto>(this.backendUrl + "/validate", body)
  }

  getAllDiscountCodes(): Observable<DiscountCodeDto[]> {
    return this.http.get<DiscountCodeDto[]>(this.backendUrl);
  }

  deleteDiscountCodes(ids: number[]): Observable<void> {
    const body = {
      body: ids
    };
    return this.http.delete<void>(this.backendUrl + "/delete", body)
  }
}
