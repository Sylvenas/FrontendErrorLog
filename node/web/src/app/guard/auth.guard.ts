import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { LoginService } from '../services/login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private user: LoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // 没有登录跳转到登录页面
    if (!this.user.getUserLoggedIn()) {
      this.router.navigate(['/login']);
    }
    return this.user.getUserLoggedIn();
  }
}
