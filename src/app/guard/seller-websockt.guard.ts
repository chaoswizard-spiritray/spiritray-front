import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerWebsocketGuard implements CanActivate {
  constructor(private router: Router) { };
  // 是否已经登录
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("sellerWeb") == null) {
      localStorage.setItem("sellerWeb", 0 + "");
    };
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("sellerWeb") == '1') {
      localStorage.setItem("sellerWeb", '0');
    };
    if (localStorage.getItem("sellerHomeWeb") == null) {
      localStorage.setItem("sellerHomeWeb", 0 + "");
    };
    if (localStorage.getItem("consumerHomeWeb") == '1') {
      localStorage.setItem("consumerHomeWeb", '0');
    };
    if (localStorage.getItem("sellerDetailWeb") == null) {
      localStorage.setItem("sellerDetailWeb", 0 + "");
    };
    if (localStorage.getItem("sellerDetailWeb") == '1') {
      localStorage.setItem("sellerDetailWeb", '0');
    };
    return true;
  }

}
