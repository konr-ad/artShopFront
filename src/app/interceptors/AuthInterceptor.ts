// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private redirecting = false;

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.method === 'OPTIONS') return next.handle(req); // preflight

    const token = sessionStorage.getItem('jwt');
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.redirecting) {
          this.redirecting = true;
          sessionStorage.removeItem('jwt');

          const returnUrl = this.router.url;           // gdzie był user
          const onLogin   = returnUrl.startsWith('/login');

          if (!onLogin) {
            this.router.navigate(['/login'], {
              queryParams: { reason: 'expired', returnUrl }
            }).finally(() => (this.redirecting = false));
          } else {
            this.redirecting = false;
          }
        }
        return throwError(() => err);
      })
    );
  }
}
