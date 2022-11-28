import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsgHomeComponent } from './msg-home.component';

const routes: Routes = [
  {
    path: '',
    component: MsgHomeComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsgHomeRoutingModule { }
