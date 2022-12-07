import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RetrieveComponent } from './retrieve/retrieve.component';
import { DefalutComponent } from './search/defalut/defalut.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    RetrieveComponent,
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
    ConsumerRoutingModule,
  ]
})
export class ConsumerModule {
}
