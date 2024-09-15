import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "./config/ConfigService";

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
  private backendUrl :string;

  constructor(private http: HttpClient, private configService: ConfigService) {
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
}
