import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { OrderDetailComponent } from '../../../order-detail/order-detail.component';
import { DatePipe } from '../../../trustUrlPipe/date.pipe';
import { TimePipe } from '../../../trustUrlPipe/time.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { ConsumerOrderRoutingModule } from './consumer-order-routing.module';
import { ConsumerOrderComponent } from './consumer-order.component';


@NgModule({
  declarations: [
    ConsumerOrderComponent,
    TrustUrlPipe,
    TimePipe,
    DatePipe,
    OrderDetailComponent,
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
