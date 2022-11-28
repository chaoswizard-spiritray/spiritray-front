import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessComponent } from './business.component';
import { EnterComponent } from './enter/enter.component';

const routes: Routes = [
  {
    path: 'enter',
    component: EnterComponent
  },
  {
    path: 'store-order',
    loadChildren: () => import('./store/store-order/store-order.module').then(m => m.StoreOrderModule)
  },
  {
    path: '',
    component: BusinessComponent,
    children:
      [
        {
          path: 'store',
          loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
        },
        {
          path: 'msg',
          loadChildren: () => import('./msg-home/msg-home.module').then(m => m.MsgHomeModule)
        },
        {
          path: 'data',
          loadChildren: () => import('./data/data.module').then(m => m.DataModule)
        },
        {
          path: 'platService',
          loadChildren: () => import('./plat-service/plat-service.module').then(m => m.PlatServiceModule)
        },
        {
          path: '',
          redirectTo: "store",
          pathMatch: "full"
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class BusinessRoutingModule { }
