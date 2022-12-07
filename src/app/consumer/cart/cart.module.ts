import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { CartRoutingModule } from './Cart-routing.module';
import { CartComponent } from './cart.component';



@NgModule({
  declarations: [
    CartComponent,
    TrustUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    CartRoutingModule,
    NgZorroAntdMobileModule
  ]
})
export class CartModule { }
