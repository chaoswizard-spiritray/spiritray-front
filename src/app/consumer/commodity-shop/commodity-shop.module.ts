import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ImgShowComponent } from '../../img-show/img-show.component';
import { LocationService } from '../../service/location.service';
import { ShippingPipe } from '../../trustUrlPipe/shipping.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { CommodityParamComponent } from './commodity-param/commodity-param.component';
import { CommodityShopRoutingModule } from './commodity-shop-routing.module';
import { CommodityShopComponent } from './commodity-shop.component';



@NgModule({
  declarations: [
    CommodityShopComponent,
    TrustUrlPipe,
    ShippingPipe,
    LocationService,
    CommodityParamComponent,
    ImgShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    CommodityShopRoutingModule
  ],
  providers: [
    { provide: 'locationService', useClass: LocationService }
  ]
})
export class CommodityShopModule { }
