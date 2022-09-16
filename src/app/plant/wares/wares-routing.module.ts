import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatAllCommodityComponent } from './plat-all-commodity/plat-all-commodity.component';
import { PlatCheckCommodityComponent } from './plat-check-commodity/plat-check-commodity.component';
import { PlatHotCommodityComponent } from './plat-hot-commodity/plat-hot-commodity.component';
import { WaresComponent } from './wares.component';

const routes: Routes = [
  {
    path: '',
    component: WaresComponent,
    children:
      [
        {
          path: 'all', component:PlatAllCommodityComponent
        
      },
        {
          path: 'check/:index',component:PlatCheckCommodityComponent
        },
        {
          path: 'hot',component:PlatHotCommodityComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaresRoutingModule { }
