import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ImgShowComponent } from '../../img-show/img-show.component';
import { DatePipe } from '../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { PlatAllCommodityComponent } from './plat-all-commodity/plat-all-commodity.component';
import { CheckDetailComponent } from './plat-check-commodity/check-detail/check-detail.component';
import { FailDetailComponent } from './plat-check-commodity/fail-detail/fail-detail.component';
import { PassDetailComponent } from './plat-check-commodity/pass-detail/pass-detail.component';
import { PlatCheckCommodityComponent } from './plat-check-commodity/plat-check-commodity.component';
import { PlatHotCommodityComponent } from './plat-hot-commodity/plat-hot-commodity.component';
import { WaresRoutingModule } from './wares-routing.module';
import { WaresComponent } from './wares.component';


@NgModule({
  declarations: [
    WaresComponent,
    TrustUrlPipe,
    PlatAllCommodityComponent,
    PlatCheckCommodityComponent,
    PlatHotCommodityComponent,
    CheckDetailComponent,
    FailDetailComponent,
    PassDetailComponent,
    ImgShowComponent,
    DatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    WaresRoutingModule
  ]
})
export class WaresModule { }
