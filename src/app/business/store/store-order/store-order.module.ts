import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { ConditionComponent } from '../../../condition/condition.component';
import { OrderDetailComponent } from '../../../order-detail/order-detail.component';
import { ReorderComponent } from '../../../reorder/reorder.component';
import { DatePipe } from '../../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { StoreOrderRoutingModule } from './store-order-routing.module';
import { MenuOrderTransComponent, StoreOrderComponent } from './store-order.component';



@NgModule({
  declarations: [
    StoreOrderComponent,
    ConditionComponent,
    ReorderComponent,
    TrustUrlPipe,
    DatePipe,
    MenuOrderTransComponent,
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    StoreOrderRoutingModule,
    NgZorroAntdMobileModule
  ]
})
export class StoreOrderModule { }
