import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatServiceComponent } from './plat-service.component';
const routes: Routes = [
  {
    path: "",
    component: PlatServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatServiceRoutingModule { }
