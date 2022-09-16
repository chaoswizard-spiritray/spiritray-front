import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        { path: 'welcome', component: WelcomeComponent },
        { path: 'closed', component: ClosedComponent },
        { path: 'storeInf', component: StoreInfComponent },
        {
          path: 'account', component: SellerAccountComponent
        },
        {
          path: 'insell', component: InSellComponent
        },
        {
          path: 'incheck', component: InCheckComponent
        },
        {
          path: 'nosell', component: NoSellComponent
        },
        { path: '', redirectTo: "welcome", pathMatch: "full" }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
