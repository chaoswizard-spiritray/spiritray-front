import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ImgShowComponent } from '../../img-show/img-show.component';
import { MsgDetailComponent } from '../../msg-detail/msg-detail.component';
import { LocationService } from '../../service/location.service';
import { CommentDatePipe } from '../../trustUrlPipe/comment-date.pipe';
import { ShippingPipe } from '../../trustUrlPipe/shipping.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { CommodityCommentComponent } from './commodity-comment/commodity-comment.component';
import { CommodityParamComponent } from './commodity-param/commodity-param.component';
import { CommodityShopRoutingModule } from './commodity-shop-routing.module';
import { CommodityShopComponent } from './commodity-shop.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';



@NgModule({
  declarations: [
    CommodityShopComponent,
    TrustUrlPipe,
    ShippingPipe,
    CommentDatePipe,
    LocationService,
    CommodityParamComponent,
    ImgShowComponent,
    CommodityCommentComponent,
    MsgDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    CommodityShopRoutingModule,
    NgZorroAntdMobileModule
  ],
  providers: [
    { provide: 'locationService', useClass: LocationService }
  ]
})
export class CommodityShopModule { }
