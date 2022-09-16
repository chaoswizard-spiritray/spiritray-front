import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
const routes: Routes = [
  {
    path: 'consumer',
    loadChildren: () => import('./consumer/consumer.module').then(m => m.ConsumerModule)
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then(m => m.BusinessModule)
  },
  {
    path: 'plant',
    loadChildren: () => import('./plant/plant.module').then(m => m.PlantModule)
  },
  {
    path: 'index',
    redirectTo: "consumer",
    pathMatch: "full"
  },
  {
    path: '',
    redirectTo: "consumer",
    pathMatch: "full"
  },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
