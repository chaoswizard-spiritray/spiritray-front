import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TimePipe } from '../../../trustUrlPipe/time.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { ConsumerOrderRoutingModule } from './consumer-order-routing.module';
import { ConsumerOrderComponent } from './consumer-order.component';


@NgModule({
  declarations: [
    ConsumerOrderComponent,
    TrustUrlPipe,
    TimePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    ConsumerOrderRoutingModule
  ]
})
export class ConsumerOrderModule { }
