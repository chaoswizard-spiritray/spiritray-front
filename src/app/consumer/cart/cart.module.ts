import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { OrderShowComponent } from '../commodity-shop/commodity-choose/order-show/order-show.component';
import { PayOverComponent } from '../commodity-shop/commodity-choose/pay-over/pay-over.component';
import { PayShowComponent } from '../commodity-shop/commodity-choose/pay-show/pay-show.component';
import { CartRoutingModule } from './Cart-routing.module';
import { CartComponent } from './cart.component';



@NgModule({
  declarations: [
    CartComponent,
    OrderShowComponent,
    PayShowComponent,
    PayOverComponent,
    TrustUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    CartRoutingModule
  ]
})
export class CartModule { }
