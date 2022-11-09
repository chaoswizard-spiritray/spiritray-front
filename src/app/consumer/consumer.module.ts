import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { BackService } from '../service/back.service';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RetrieveComponent } from './retrieve/retrieve.component';



@NgModule({
  declarations: [
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    RetrieveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    ConsumerRoutingModule
  ]
})
export class ConsumerModule {
}
