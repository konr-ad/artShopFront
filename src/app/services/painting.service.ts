import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of, switchMap} from 'rxjs';
import { ConfigService } from './config/ConfigService';

export interface Painting {
  id?: number;
  type: string;
  state: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl?: string;
}

export interface MediaFileDto {
  url: string;
  type: 'JPEG' | 'PNG';
  isPrimary: boolean;
  sortOrder: number;
  originalFilename?: string;
}

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface PaintingListDto {
  id: number;
  name: string;
  type: string;
  state: string | null;
  price: number;
  thumbnailUrl: string | null;
}

export interface PaintingDetailsDto {
  id: number;
  name: string;
  type: string;
  state: string | null;
  price: number;
  description: string | null;
  quantity: number;
  media: MediaFileDto[];
}

export interface CreatePaintingRequest {
  name: string;
  type: string;
  state?: string | null;
  price: number;
  descriptionEn?: string | null;
  descriptionPl?: string | null;
}

export type PaintingType = 'MONOTYPE'|'PRINT'|'OIL'|'ACRYLIC'|'WATERCOLOR'|'DIGITAL';

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  private backendUrl: string;
  private readonly api = this.configService.getConfig('API_URL');
  private readonly publicUrl = `${this.api}/api/paintings`;
  private readonly adminUrl  = `${this.api}/api/admin/paintings`;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/paintings';
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // zakładamy, że tu trzymasz JWT
    let headers = new HttpHeaders();
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  /** HELPER: sklej pełny URL jeśli backend zwraca względny */
  fullUrl(maybeRelative: string | null | undefined) {
    if (!maybeRelative) return null;
    return maybeRelative.startsWith('http')
      ? maybeRelative
      : `${this.api}${maybeRelative}`;
  }
  getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.backendUrl);
  }

  getPaintingsPage(opts: {
    page?: number; size?: number; sort?: string; q?: string;
    type?: string; minPrice?: number; maxPrice?: number;
  } = {}): Observable<Page<PaintingListDto>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 10))
      .set('sort', opts.sort ?? 'createdAt,desc');

    if (opts.q) params = params.set('q', opts.q);
    if (opts.type) params = params.set('type', opts.type);
    if (opts.minPrice != null) params = params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice != null) params = params.set('maxPrice', String(opts.maxPrice));

    return this.http.get<Page<PaintingListDto>>(this.publicUrl, { params });
  }

  createWithMedia(dto: CreatePaintingRequest, files: File[], primaryIndex = 0) {
    const fd = new FormData();
    // meta jako JSON+Blob -> kluczowe!
    fd.append('meta', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    files.forEach(f => fd.append('files', f));
    fd.append('primaryIndex', String(primaryIndex));

    return this.http.post<PaintingDetailsDto>(
      this.adminUrl,
      fd
    );
  }

}
