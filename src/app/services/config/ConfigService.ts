import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) {}

  // Load config.json from assets directory
  loadConfig(): Observable<any> {
    return this.http.get('/assets/config/config.json').pipe(
      map(config => {
        this.config = config;
        return config;
      })
    );
  }

  // Get a specific key from config.json
  getConfig(key: string): any {
    if (!this.config) {
      throw new Error('Config file not loaded!');
    }
    return this.config[key];
  }
}
