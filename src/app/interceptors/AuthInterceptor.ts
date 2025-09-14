import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService} from "../services/AuthService";
import {ConfigService} from "../services/config/ConfigService";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cfg: ConfigService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = sessionStorage.getItem('jwt'); // lub localStorage
    if (!token) return next.handle(req);

    return next.handle(
      req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    );
  }
}
