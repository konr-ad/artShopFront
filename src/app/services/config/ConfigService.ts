import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config?: Record<string, any>;

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    const url = 'assets/config/config.json';
    return firstValueFrom(this.http.get<Record<string, any>>(url, { headers: { 'Cache-Control': 'no-store' } }))
      .then(cfg => { this.config = cfg; });
  }

  getConfig<T = any>(key: string): T {
    if (!this.config) throw new Error('Config file not loaded!');
    const val = this.config[key];
    if (val === undefined) throw new Error(`Missing config key: ${key}`);
    return val as T;
  }
}
