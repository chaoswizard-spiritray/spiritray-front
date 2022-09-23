import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommodityShopComponent } from './commodity-shop.component';

const routes: Routes = [
  {
    path: 'choose',
    loadChildren: () => import('./commodity-choose/commodity-choose.module').then(m => m.CommodityChooseModule)
  },
  {
    path: '',
    component: CommodityShopComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommodityShopRoutingModule { }
