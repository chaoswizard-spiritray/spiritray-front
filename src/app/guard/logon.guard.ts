import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogonGuard implements CanActivate {
  constructor(private router: Router) { };
  // 是否已经登录
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem("staffId") == null) {
      this.router.navigateByUrl("/plant/logon");
      return false;
    }
    // 否则就放行
    return true;
  }
}
