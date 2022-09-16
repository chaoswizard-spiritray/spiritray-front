import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommodityChooseComponent } from './commodity-choose/commodity-choose.component';
import { CommodityShopComponent } from './commodity-shop.component';

const routes: Routes = [
  {
    path: 'choose',
    component: CommodityChooseComponent
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
