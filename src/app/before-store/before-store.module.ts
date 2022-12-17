import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../trustUrlPipe/trust-url.pipe';
import { BeforeStoreRoutingModule } from './before-store-routing.module';
import { BeforeStoreComponent } from './before-store.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MsgDetailComponent } from '../msg-detail/msg-detail.component';
import { ImgShowComponent } from '../img-show/img-show.component';
import { StoreCloseComponent } from './store-close/store-close.component';
import { ClsoeInfoMenuComponent } from './clsoe-info-menu/clsoe-info-menu.component';


@NgModule({
  declarations: [
    TrustUrlPipe,
    BeforeStoreComponent,
    MsgDetailComponent,
    ImgShowComponent,
    StoreCloseComponent,
    ClsoeInfoMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    BeforeStoreRoutingModule,
    NgZorroAntdMobileModule
  ]
})
export class BeforeStoreModule {
}
