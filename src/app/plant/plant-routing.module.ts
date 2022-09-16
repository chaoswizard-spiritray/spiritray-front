import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogonGuard } from '../guard/logon.guard';
import { PlantComponent } from './plant.component';

const routes: Routes = [
  {
    path: "logon",
    loadChildren: () => import('./logon/logon.module').then(m => m.LogonModule)
  },
  {
    path: "",
    component: PlantComponent,
    children:
      [
        {
          path: "platform",
          loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule)
        },
        {
          path: "shop",
          loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
        },
        {
          path: "wares",
          loadChildren: () => import('./wares/wares.module').then(m => m.WaresModule)
        },
        {
          path: "",
          redirectTo: "platform",
          pathMatch: "full"
        }
      ],
    canActivate: [LogonGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class PlantRoutingModule { }
