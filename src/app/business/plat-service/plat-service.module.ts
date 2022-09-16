import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { PlatServiceRoutingModule } from './plat-service-routing.module';
import { PlatServiceComponent } from './plat-service.component';



@NgModule({
  declarations: [
    PlatServiceComponent,
    TrustUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    PlatServiceRoutingModule
  ]
})
export class PlatServiceModule { }
