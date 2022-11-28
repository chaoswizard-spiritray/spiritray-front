import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreOrderComponent } from './store-order.component';

const routes: Routes = [
  {
    path: ':flag',
    component: StoreOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreOrderRoutingModule { }
