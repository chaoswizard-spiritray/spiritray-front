import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../../guard/login.guard';
import { MyspiritComponent } from './myspirit.component';

const routes: Routes = [
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
