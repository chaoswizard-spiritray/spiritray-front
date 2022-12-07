import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { MsgDetailComponent } from '../../msg-detail/msg-detail.component';
import { DatePipe } from '../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { MsgHomeRoutingModule } from './msg-home-routing.module';
import { MsgHomeComponent } from './msg-home.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { ImgShowComponent } from '../../img-show/img-show.component';


@NgModule({
  declarations: [
    TrustUrlPipe,
    DatePipe,
    MsgHomeComponent,
    MsgDetailComponent,
    ImgShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    MsgHomeRoutingModule,
    NgZorroAntdMobileModule
  ]
})
export class MsgHomeModule { }
