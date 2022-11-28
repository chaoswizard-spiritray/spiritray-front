import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreRouterDataService } from '../service/store-router-data.service';

@Injectable({
  providedIn: 'root'
})
export class StoreSearchGuard implements CanActivate {
  constructor(
    private srd: StoreRouterDataService
  ) { };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ((state.url == "/business/store/insell") || (state.url == "/business/store/nosell") || (state.url == "/business/store/incheck")) {
      this.srd.isShowSearch = 1;
    } else {
      this.srd.isShowSearch = 0;
    }
    return true;
  }

}
