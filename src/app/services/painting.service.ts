import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
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

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export interface PaintingListItem {
  id: number;
  name: string;
  type: string;
  state: string | null;
  price: number;
  thumbnailUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  private backendUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.backendUrl = this.configService.getConfig('API_URL') + '/api/paintings';
  }

  getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.backendUrl);
  }

  getPaintingById(id: number): Observable<Painting> {
    return this.http.get<Painting>(`${this.backendUrl}/${id}`);
  }

  createPainting(painting: FormData): Observable<Painting> {
    return this.http.post<Painting>(this.backendUrl, painting);
  }

  getPaintingsPage(opts: { page?: number; size?: number; sort?: string; q?: string; type?: string; minPrice?: number; maxPrice?: number } = {}) {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 10))
      .set('sort', opts.sort ?? 'createdAt,desc');

    if (opts.q) params = params.set('q', opts.q);
    if (opts.type) params = params.set('type', opts.type);
    if (opts.minPrice != null) params = params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice != null) params = params.set('maxPrice', String(opts.maxPrice));

    return this.http.get<Page<PaintingListItem>>(this.backendUrl, { params });
  }
}
