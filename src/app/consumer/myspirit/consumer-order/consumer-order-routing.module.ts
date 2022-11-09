import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerOrderComponent } from './consumer-order.component';

const routes: Routes = [
  {
    path: '',
    component: ConsumerOrderComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerOrderRoutingModule { }
