import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../../guard/login.guard';
import { ConsumerOrderComponent } from './consumer-order/consumer-order.component';
import { MyspiritComponent } from './myspirit.component';

const routes: Routes = [
  {
    path: 'order/:flag',
    component: ConsumerOrderComponent,
  },
  {
    path: '',
    component: MyspiritComponent,
    canActivate: [LoginGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyspiritRoutingModule { }
