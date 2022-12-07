import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';



@NgModule({
  declarations: [
    HomeComponent,
    TrustUrlPipe
  ],
  imports: [
    NgZorroAntdMobileModule,
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
