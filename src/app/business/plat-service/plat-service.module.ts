import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '../../trustUrlPipe/date.pipe';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { PlatServiceRoutingModule } from './plat-service-routing.module';
import { PlatServiceComponent } from './plat-service.component';
import { SlideImgComponent } from './slide-img/slide-img.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';



@NgModule({
  declarations: [
    PlatServiceComponent,
    TrustUrlPipe,
    DatePipe,
    SlideImgComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    PlatServiceRoutingModule,
    NgZorroAntdMobileModule
  ]
})
export class PlatServiceModule { }
