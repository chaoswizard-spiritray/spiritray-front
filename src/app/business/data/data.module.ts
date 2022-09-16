import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TrustUrlPipe } from '../../trustUrlPipe/trust-url.pipe';
import { DataRoutingModule } from './data-routing.module';
import { DataComponent } from './data.component';



@NgModule({
  declarations: [
    DataComponent,
    TrustUrlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    DataRoutingModule
  ]
})
export class DataModule { }
