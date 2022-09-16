import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import { EnterComponent } from './enter/enter.component';




@NgModule({
  declarations: [
    EnterComponent,
    BusinessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    BusinessRoutingModule
  ]
})
export class BusinessModule { }
