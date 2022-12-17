import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ImgShowComponent } from '../../img-show/img-show.component';
import { LocationService } from '../../service/location.service';
import { PositionService } from '../../service/position.service';
import { DatePipe } from '../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { DetailShowComponent } from '../detail-show/detail-show.component';
import { ClosedComponent } from './closed/closed.component';
import { CheckDetailComponent } from './in-check/check-detail/check-detail.component';
import { InCheckComponent } from './in-check/in-check.component';
import { InSellDetailComponent } from './in-sell/in-sell-detail/in-sell-detail.component';
import { InSellComponent } from './in-sell/in-sell.component';
import { NoSellComponent } from './no-sell/nosell.component';
import { PublishComponent } from './publish/publish.component';
import { PutDataComponent } from './publish/put-data/put-data.component';
import { CreateAccountComponent } from './seller-account/create-account/create-account.component';
import { ModifyAccountComponent } from './seller-account/modify-account/modify-account.component';
import { SellerAccountComponent } from './seller-account/seller-account.component';
import { StoreInfComponent } from './store-inf/store-inf.component';
import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { CommodityDetailComponent } from './in-sell/commodity-detail/commodity-detail.component';
import { ChinaDatePipe } from '../../trustUrlPipe/china-date.pipe';
import { NoSellDetailComponent } from './no-sell/no-sell-detail/no-sell-detail.component';
import { AddSkuNumComponent } from './in-sell/add-sku-num/add-sku-num.component';
import { ModifySkuPriceComponent } from './in-sell/modify-sku-price/modify-sku-price.component';


@NgModule({
  declarations: [
    StoreComponent,
    ChinaDatePipe,
    WelcomeComponent,
    StoreInfComponent,
    SellerAccountComponent,
    PublishComponent,
    InSellComponent,
    InCheckComponent,
    NoSellComponent,
    ClosedComponent,
    PutDataComponent,
    TrustUrlPipe,
    DetailShowComponent,
    ModifyAccountComponent,
    CreateAccountComponent,
    ImgShowComponent,
    CheckDetailComponent,
    DatePipe,
    InSellDetailComponent,
    CommodityDetailComponent,
    NoSellDetailComponent,
    AddSkuNumComponent,
    ModifySkuPriceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    StoreRoutingModule,
    NgZorroAntdMobileModule
  ],
  providers: [
    { provide: 'locationService', useClass: LocationService },
    { provide: 'positionService', useClass: PositionService }
  ]
})
export class StoreModule { }
