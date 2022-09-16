import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../../../guard/login.guard';
import { SetComponent } from './set.component';

const routes: Routes = [
  {
    path: '',
    component: SetComponent,
    canActivate: [LoginGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetRoutingModule { }
