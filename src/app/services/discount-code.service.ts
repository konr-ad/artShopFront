import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config/ConfigService';

export interface DiscountCodeDto {
  id: number;
  code: string;
  discountValue: number;
  discountType: string;
  minimumOrderValue: number;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  validTo: Date;
  validFrom: Date;
}

export interface DiscountCodeCreateRequest {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minimumOrderValue: number;
  isActive: boolean;
  validFrom: string; // 'YYYY-MM-DD'
  validTo: string;   // 'YYYY-MM-DD'
}

export interface DiscountCodeRequest {
  code: string;
  orderValue: number;
}

export interface DiscountCodeResponse {
  message: string;
  discountValue: number;
  valid: boolean;
  discountType: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountCodeService {
  private backendUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.backendUrl = configService.getConfig('API_URL') + '/api/discountcodes';
  }

  createDiscountCode(discountCode: DiscountCodeCreateRequest): Observable<DiscountCodeDto> {
    return this.http.post<DiscountCodeDto>(this.backendUrl, discountCode);
  }

  validateDiscountCode(code: string, orderValue: number): Observable<DiscountCodeResponse> {
    const body: DiscountCodeRequest = { code, orderValue };
    return this.http.post<DiscountCodeResponse>(`${this.backendUrl}/validate`, body);
  }

  getAllDiscountCodes(): Observable<DiscountCodeDto[]> {
    return this.http.get<DiscountCodeDto[]>(this.backendUrl);
  }

  deleteDiscountCodes(ids: number[]): Observable<void> {
    return this.http.request<void>('DELETE', this.backendUrl, { body: ids });
  }

}
