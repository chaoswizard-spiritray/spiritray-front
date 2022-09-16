import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../../guard/login.guard';
import { CartComponent } from './cart.component';


const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [LoginGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
