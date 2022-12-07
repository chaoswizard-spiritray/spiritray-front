import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { PayMethodComponent } from './pay-method/pay-method.component';
import { AddAccountComponent } from './plant-account/add-account/add-account.component';
import { PlantAccountComponent } from './plant-account/plant-account.component';
import { SetAccountComponent } from './plant-account/set-account/set-account.component';
import { PlatformRoutingModule } from './platform-routing.module';
import { PlatformComponent } from './platform.component';
import { SlideImgComponent } from './slide-img/slide-img.component';



@NgModule({
  declarations: [
    PlatformComponent,
    TrustUrlPipe,
    DatePipe,
    PayMethodComponent,
    PlantAccountComponent,
    AddAccountComponent,
    SetAccountComponent,
    SlideImgComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    PlatformRoutingModule
  ]
})
export class PlatformModule { }
