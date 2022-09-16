import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';



@NgModule({
  declarations: [
    ShopComponent,
    TrustUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
