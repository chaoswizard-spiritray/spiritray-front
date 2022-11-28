import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreSearchGuard } from '../../guard/store-search.guard';
import { ClosedComponent } from './closed/closed.component';
import { InCheckComponent } from './in-check/in-check.component';
import { InSellComponent } from './in-sell/in-sell.component';
import { NoSellComponent } from './no-sell/nosell.component';
import { SellerAccountComponent } from './seller-account/seller-account.component';
import { StoreInfComponent } from './store-inf/store-inf.component';
import { StoreComponent } from './store.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    children:
      [
        { path: 'welcome', component: WelcomeComponent, canActivate: [StoreSearchGuard] },
        { path: 'closed', component: ClosedComponent, canActivate: [StoreSearchGuard] },
        { path: 'storeInf', component: StoreInfComponent, canActivate: [StoreSearchGuard] },
        {
          path: 'account', component: SellerAccountComponent, canActivate: [StoreSearchGuard]
        },
        {
          path: 'insell', component: InSellComponent, canActivate: [StoreSearchGuard]
        },
        {
          path: 'incheck', component: InCheckComponent, canActivate: [StoreSearchGuard]
        },
        {
          path: 'nosell', component: NoSellComponent, canActivate: [StoreSearchGuard]
        },
        { path: '', redirectTo: "welcome", pathMatch: "full", canActivate: [StoreSearchGuard] }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
