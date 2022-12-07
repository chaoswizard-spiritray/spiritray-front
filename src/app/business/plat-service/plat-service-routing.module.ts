import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatServiceComponent } from './plat-service.component';
import { SlideImgComponent } from './slide-img/slide-img.component';
const routes: Routes = [
  {
    path: "",
    component: PlatServiceComponent,
    children:
      [
        { path: 'slide', component: SlideImgComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatServiceRoutingModule { }
