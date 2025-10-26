import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config/ConfigService';
import { Observable, tap } from 'rxjs';

interface LoginResponse { token: string;}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'jwt';

  constructor(private http: HttpClient, private cfg: ConfigService) {}

  private get api() { return this.cfg.getConfig<string>('API_URL'); }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.api}/api/auth/login`, { username, password })
      .pipe(tap(res => sessionStorage.setItem(this.key, res.token)));
  }

  getToken() { return sessionStorage.getItem(this.key); }

  logout() { sessionStorage.removeItem(this.key); }

  private decodePayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (_) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.decodePayload();
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  cleanIfExpired() {
    if (this.isTokenExpired()) {
      sessionStorage.removeItem(this.key);
    }
  }

  isLoggedIn(): boolean {
    this.cleanIfExpired();
    return !!this.getToken();
  }

}
