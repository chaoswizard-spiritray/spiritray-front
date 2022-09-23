import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CodeInputModule } from 'angular-code-input';
import { ImgShowComponent } from '../../../img-show/img-show.component';
import { PositionComponent } from '../../../position/position.component';
import { ShippingPipe } from '../../../trustUrlPipe/shipping.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { AddressMenuComponent } from '../../myspirit/set/address/address-menu/address-menu.component';
import { CommodityChooseComponent } from '.././commodity-choose/commodity-choose.component';
import { OrderShowComponent } from '.././commodity-choose/order-show/order-show.component';
import { PayOverComponent } from '.././commodity-choose/pay-over/pay-over.component';
import { PayShowComponent } from '.././commodity-choose/pay-show/pay-show.component';
import { CommodityParamComponent } from '.././commodity-param/commodity-param.component';
import { CommodityShopComponent } from '.././commodity-shop.component';
import { CommodityChooseRoutingModule } from './commodity-choose-routing.module';



@NgModule({
  declarations: [
    CommodityShopComponent,
    TrustUrlPipe,
    ShippingPipe,
    CommodityParamComponent,
    CommodityChooseComponent,
    ImgShowComponent,
    OrderShowComponent,
    PayShowComponent,
    PayOverComponent,
    AddressMenuComponent,
    PositionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    CommodityChooseRoutingModule,
    CodeInputModule
  ]
})
export class CommodityChooseModule { }
