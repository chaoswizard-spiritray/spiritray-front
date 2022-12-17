import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { DefalutComponent } from '../search/defalut/defalut.component';
import { SearchResultComponent } from '../search/search-result/search-result.component';
import { SearchComponent } from '../search/search.component';
import { SearchRoutingModule } from './search-routing.module';


@NgModule({
  declarations: [
    TrustUrlPipe,
    SearchComponent,
    DefalutComponent,
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    SearchRoutingModule,
  ]
})
export class SearchModule {
}
