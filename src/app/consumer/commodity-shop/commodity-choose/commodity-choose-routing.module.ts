import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommodityChooseComponent } from './commodity-choose.component';
import { OrderShowComponent } from './order-show/order-show.component';
import { PayOverComponent } from './pay-over/pay-over.component';
import { PayShowComponent } from './pay-show/pay-show.component';

const routes: Routes = [
  {
    path: '',
    component: CommodityChooseComponent
  },
  {
    path: 'order',
    component: OrderShowComponent
  },
  {
    path: 'pay-show',
    component: PayShowComponent
  },
  {
    path: 'pay-over',
    component: PayOverComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommodityChooseRoutingModule { }
