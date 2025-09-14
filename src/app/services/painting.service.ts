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
  description?: string | null;
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

  getPaintingById(id: number): Observable<PaintingDetailsDto> {
    return this.http.get<PaintingDetailsDto>(`${this.publicUrl}/${id}`);
  }

  // createPainting(painting: FormData): Observable<Painting> {
  //   return this.http.post<Painting>(this.backendUrl, painting);
  // }

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

  createPainting(formData: FormData): Observable<PaintingDetailsDto> {
    const name = String(formData.get('name') ?? '');
    const type = String(formData.get('type') ?? '');
    const price = Number(formData.get('price') ?? 0);
    const descriptionVal = formData.get('description');
    const description = descriptionVal ? String(descriptionVal) : undefined;

    // pliki
    const primary = (formData.get('image') as File) || null;
    const additional = (formData.getAll('additionalImages') || [])
      .filter((x): x is File => x instanceof File);

    const dto: CreatePaintingRequest = { name, type, price, description };

    // 1) create
    return this.http.post<PaintingDetailsDto>(this.adminUrl, dto).pipe(
      // 2) upload jeśli są pliki
      switchMap(created => {
        const files: File[] = [];
        if (primary) files.push(primary);
        if (additional?.length) files.push(...additional);

        if (files.length === 0) {
          return of(created);
        }

        const fd = new FormData();
        files.forEach(f => fd.append('files', f));
        fd.append('primaryIndex', '0');

        return this.http.post(`${this.adminUrl}/${created.id}/media`, fd).pipe(
          // 3) pobierz finalne detale (z mediami)
          switchMap(() => this.getPaintingById(created.id))
        );
      })
    );
  }

  adminCreate(dto: CreatePaintingRequest): Observable<PaintingDetailsDto> {
    return this.http.post<PaintingDetailsDto>(
      this.adminUrl,
      dto,
      { headers: this.authHeaders() }
    );
  }

  adminUploadMedia(paintingId: number, files: File[], primaryIndex = 0): Observable<any> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));          // NAZWA 'files' musi się zgadzać z backendem
    form.append('primaryIndex', String(primaryIndex));    // pierwszy plik będzie primary

    // UWAGA: NIE ustawiaj Content-Type ręcznie przy FormData (Angular doda boundary)
    return this.http.post(
      `${this.adminUrl}/${paintingId}/media`,
      form,
      { headers: this.authHeaders() }
    );
  }

  details(id: number): Observable<PaintingDetailsDto> {
    // publiczny endpoint GET /api/paintings/{id} (bez auth headera też zadziała)
    return this.http.get<PaintingDetailsDto>(`${this.publicUrl}/${id}`);
  }

}
