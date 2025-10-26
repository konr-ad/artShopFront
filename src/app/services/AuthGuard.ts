// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService} from "./AuthService";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) return true;

    this.auth.logout();
    this.router.navigate(['/login'], { queryParams: { reason: 'expired' } });
    return false;
  }
  canActivateChild()  { return this.check(); }

  private check(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
