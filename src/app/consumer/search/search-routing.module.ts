import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefalutComponent } from './defalut/defalut.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: '', component: SearchComponent,
    children:
      [
        {
          path: '',
          redirectTo: '/consumer/search/default',
          pathMatch: 'full'
        },
        {
          path: 'default',
          component: DefalutComponent
        },
        {
          path: 'result',
          component: SearchResultComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SearchRoutingModule { }
