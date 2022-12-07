import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayMethodComponent } from './pay-method/pay-method.component';
import { PlantAccountComponent } from './plant-account/plant-account.component';
import { PlatformComponent } from './platform.component';
import { SlideImgComponent } from './slide-img/slide-img.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformComponent,
    children:
      [
        { path: 'pay', component: PayMethodComponent },
        { path: 'account', component: PlantAccountComponent },
        { path: 'slide', component: SlideImgComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }
