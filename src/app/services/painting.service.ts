import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { ConfigService } from './config/ConfigService';

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

// --- LEGACY (compat) ---
export interface Painting {
  id?: number;
  type: string;
  state: string | null;
  name: string;
  description?: string | null;
  price: number;
  image?: string;              // kiedyś tu był base64 – teraz opcjonalne
  imageUrl?: string | null;    // pełny URL miniatury
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

export interface PaintingListDto {
  id: number;
  name: string;
  type: string;
  state: string | null;
  price: number;
  thumbnailUrl: string | null;
}
export type PaintingListItem = PaintingListDto; // alias dla komponentu

export interface CreatePaintingRequest {
  name: string;
  type: string;                 // EPaintingType jako string
  state?: string | null;        // OPTIONAL
  price: number;
  descriptionEn?: string | null;
  descriptionPl?: string | null;
}

export type PaintingType =
  | 'MONOTYPE' | 'PRINT' | 'OIL' | 'ACRYLIC' | 'WATERCOLOR' | 'DIGITAL';

@Injectable({ providedIn: 'root' })
export class PaintingService {
  private apiBase = this.configService.getConfig('API_URL');
  private publicUrl = `${this.apiBase}/api/paintings`;
  private adminUrl  = `${this.apiBase}/api/admin/paintings`;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  /** Zwróć pełny URL – jeśli względny z backendu (/media/...), doklej API_URL */
  imageUrl(u: string | null | undefined): string | undefined {
    if (!u) return undefined;
    return u.startsWith('http') ? u : `${this.apiBase}${u}`;
  }

  /** Listing stronicowany */
  getPaintingsPage(opts: {
    page?: number; size?: number; sort?: string; q?: string;
    type?: string; minPrice?: number; maxPrice?: number;
  } = {}): Observable<Page<PaintingListItem>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 9))
      .set('sort', opts.sort ?? 'createdAt,desc');

    if (opts.q) params = params.set('q', opts.q);
    if (opts.type) params = params.set('type', opts.type);
    if (opts.minPrice != null) params = params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice != null) params = params.set('maxPrice', String(opts.maxPrice));

    return this.http.get<Page<PaintingListItem>>(this.publicUrl, { params });
  }


  /** Tworzenie + media (multipart/form-data) */
  createWithMedia(dto: CreatePaintingRequest, files: File[], primaryIndex = 0): Observable<PaintingDetailsDto> {
    const fd = new FormData();
    fd.append('meta', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    files.forEach(f => fd.append('files', f));
    fd.append('primaryIndex', String(primaryIndex));
    return this.http.post<PaintingDetailsDto>(this.adminUrl, fd);
  }

  /** @deprecated: użyj getPaintingsPage(..).
   *  Zwraca kształt jak dawniej, mapując thumbnail->imageUrl. */
  getPaintings(): Observable<Painting[]> {
    return this.getPaintingsPage({ page: 0, size: 100, sort: 'createdAt,desc' })
      .pipe(map(p =>
        p.content.map(item => ({
          id: item.id,
          type: item.type,
          state: item.state ?? null,
          name: item.name,
          description: null,              // w listingu nie mamy opisu
          price: item.price,
          image: '',                      // nie trzymamy już base64
          imageUrl: this.imageUrl(item.thumbnailUrl) ?? null,
        }))
      ));
  }

  // GET /api/paintings/{id}
  details(id: number): Observable<PaintingDetailsDto> {
    return this.http.get<PaintingDetailsDto>(`${this.publicUrl}/${id}`);
  }

  fullUrl(path?: string | null): string | null {
    if (!path) return null;

    // jeśli już absolutny (http/https, data:, blob:) – zostaw jak jest
    if (/^(?:https?:|data:|blob:)/i.test(path)) return path;

    try {
      // baza bez końcowych slaszy + dokładamy jeden
      const base = this.apiBase.replace(/\/+$/, '') + '/';
      // ścieżka bez wiodących slaszy (żeby nie zrobić podwójnego //)
      const rel  = path.replace(/^\/+/, '');
      return new URL(rel, base).toString();
    } catch {
      // awaryjnie „na sztywno”
      return `${this.apiBase.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    }
  }

}
