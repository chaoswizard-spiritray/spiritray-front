import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogonGuard } from '../guard/logon.guard';
import { PlantWebsocketGuard } from '../guard/plant-websockt.guard copy';
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
          path: 'msg',
          loadChildren: () => import('./msg-home/msg-home.module').then(m => m.MsgHomeModule)
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
    canActivate: [LogonGuard, PlantWebsocketGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class PlantRoutingModule { }
