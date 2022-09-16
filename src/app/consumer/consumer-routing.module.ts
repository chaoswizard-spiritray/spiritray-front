import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../guard/login.guard';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'shop/:commodityId',
    loadChildren: () => import('./commodity-shop/commodity-shop.module').then(m => m.CommodityShopModule)
  },
  {
    path: 'set',
    loadChildren: () => import('./myspirit/set/set.module').then(m => m.SetModule),
    canActivate: [LoginGuard]
  },
  {
    path: '',
    component: IndexComponent,
    children:
      [
        {
          path: 'home',
          loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
        },
        {
          path: 'attention',
          loadChildren: () => import('./attention/attention.module').then(m => m.AttentionModule)
        },
        {
          path: 'cart',
          loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
        },
        {
          path: 'myspirit',
          loadChildren: () => import('./myspirit/myspirit.module').then(m => m.MyspiritModule)
        },
        { path: '', redirectTo: "/consumer/home", pathMatch: "full" }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ConsumerRoutingModule { }
