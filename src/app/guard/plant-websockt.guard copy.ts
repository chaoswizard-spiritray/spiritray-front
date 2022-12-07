import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantWebsocketGuard implements CanActivate {
  constructor(private router: Router) { };
  // 是否已经登录
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("plantWeb") == null) {
      localStorage.setItem("plantWeb", 0 + "");
    };
    //用于解决刷新时全局websocket无法更新问题
    if (localStorage.getItem("plantWeb") == '1') {
      localStorage.setItem("plantWeb", '0');
    };
    if (localStorage.getItem("plantHomeWeb") == null) {
      localStorage.setItem("plantHomeWeb", 0 + "");
    };
    if (localStorage.getItem("consumerHomeWeb") == '1') {
      localStorage.setItem("consumerHomeWeb", '0');
    };
    if (localStorage.getItem("plantDetailWeb") == null) {
      localStorage.setItem("plantDetailWeb", 0 + "");
    };
    if (localStorage.getItem("plantDetailWeb") == '1') {
      localStorage.setItem("plantDetailWeb", '0');
    };
    return true;
  }

}
