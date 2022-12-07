import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ImgShowComponent } from '../../img-show/img-show.component';
import { MsgDetailComponent } from '../../msg-detail/msg-detail.component';
import { MsgHomeRoutingModule } from './msg-home-routing.module';
import { MsgHomeComponent } from './msg-home.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { DatePipe } from '../../trustUrlPipe/date.pipe';


@NgModule({
  declarations: [
    TrustUrlPipe,
    DatePipe,
    MsgHomeComponent,
    ImgShowComponent,
    MsgDetailComponent
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
