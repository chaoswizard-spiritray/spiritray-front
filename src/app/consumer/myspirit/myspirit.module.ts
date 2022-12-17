import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ChinaDatePipe } from '../../trustUrlPipe/china-date.pipe';
import { TimePipe } from '../../trustUrlPipe/time.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { AttentionComponent } from './attention/attention.component';
import { CommodityCollectionComponent } from './commodity-collection/commodity-collection.component';
import { HistoryComponent } from './history/history.component';
import { MyspiritRoutingModule } from './myspirit-routing.module';
import { MyspiritComponent } from './myspirit.component';


@NgModule({
  declarations: [
    MyspiritComponent,
    TrustUrlPipe,
    TimePipe,
    CommodityCollectionComponent,
    AttentionComponent,
    HistoryComponent,
    ChinaDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    MyspiritRoutingModule,
  ]
})
export class MyspiritModule { }
