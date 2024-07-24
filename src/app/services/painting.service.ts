import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private apiUrl = 'http://25.53.71.208:8080/api/paintings';

  constructor(private http: HttpClient) {}

  getPaintings(): Observable<Painting[]> {
    return this.http.get<Painting[]>(this.apiUrl);
  }

  getPaintingById(id: number): Observable<Painting> {
    return this.http.get<Painting>(`${this.apiUrl}/${id}`);
  }

  createPainting(painting: FormData): Observable<Painting> {
    return this.http.post<Painting>(this.apiUrl, painting);
  }
}
