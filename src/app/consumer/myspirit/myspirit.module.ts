import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TimePipe } from '../../trustUrlPipe/time.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { ConsumerOrderComponent } from './consumer-order/consumer-order.component';
import { MyspiritRoutingModule } from './myspirit-routing.module';
import { MyspiritComponent } from './myspirit.component';


@NgModule({
  declarations: [
    MyspiritComponent,
    TrustUrlPipe,
    TimePipe,
    ConsumerOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    MyspiritRoutingModule
  ]
})
export class MyspiritModule { }
