import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeStoreComponent } from './before-store.component';
import { StoreCloseComponent } from './store-close/store-close.component';


const routes: Routes = [
  {
    path: '', component: BeforeStoreComponent
  },
  {
    path: 'close', component: StoreCloseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class BeforeStoreRoutingModule { }
