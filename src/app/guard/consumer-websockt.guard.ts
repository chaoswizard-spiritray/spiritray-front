import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumerWebsocketGuard implements CanActivate {
  constructor(private router: Router) { };
  // 是否已经登录
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("consumerWeb") == null) {
      localStorage.setItem("consumerWeb", 0 + "");
    };
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("consumerWeb") == '1') {
      localStorage.setItem("consumerWeb", '0');
    };
    if (localStorage.getItem("consumerHomeWeb") == null) {
      localStorage.setItem("consumerHomeWeb", 0 + "");
    };
    if (localStorage.getItem("consumerHomeWeb") == '1') {
      localStorage.setItem("consumerHomeWeb", '0');
    };
    if (localStorage.getItem("consumerDetailWeb") == null) {
      localStorage.setItem("consumerDetailWeb", 0 + "");
    };
    if (localStorage.getItem("consumerDetailWeb") == '1') {
      localStorage.setItem("consumerDetailWeb", '0');
    };
    return true;
  }

}
