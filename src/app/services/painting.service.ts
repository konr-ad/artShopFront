import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Painting {
  id?: number;
  name: string;
  type: string;
  state: string;
  length: number;
  width: number;
  price: number;
  image: File;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private apiUrl = 'http://localhost:8080/api/paintings';

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
