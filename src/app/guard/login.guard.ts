import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { };
  // 是否已经登录
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem("jwt") == null) {
      /** 如果本地并没有缓存信息，
          那么就直接拉取登录页面，
          因为只要你没有登录就不会有信息，
          关键地址你都无法访问，即使你登录已经过期了，
          后端会进行jwt检测，如果不符合就返回清空信息，重新登录
          */
      this.router.navigateByUrl("/consumer/login");
      return false;
    }
    // 否则就放行
    return true;
  }

}
