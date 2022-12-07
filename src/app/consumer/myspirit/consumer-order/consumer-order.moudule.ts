import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { OrderDetailComponent } from '../../../order-detail/order-detail.component';
import { DatePipe } from '../../../trustUrlPipe/date.pipe';
import { TimePipe } from '../../../trustUrlPipe/time.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { CommentPublishComponent } from './comment-publish/comment-publish.component';
import { CommentShowComponent } from './comment-show/comment-show.component';
import { ConsumerOrderRoutingModule } from './consumer-order-routing.module';
import { ConsumerOrderComponent } from './consumer-order.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { ImgShowComponent } from '../../../img-show/img-show.component';

@NgModule({
  declarations: [
    ConsumerOrderComponent,
    TrustUrlPipe,
    TimePipe,
    DatePipe,
    ImgShowComponent,
    OrderDetailComponent,
    CommentShowComponent,
    CommentPublishComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    NgZorroAntdMobileModule,
    ConsumerOrderRoutingModule
  ]
})
export class ConsumerOrderModule { }
