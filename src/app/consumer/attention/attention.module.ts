import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AttentionRoutingModule } from './attention-routing.module';
import { AttentionComponent } from './attention.component';



@NgModule({
  declarations: [
    AttentionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    AttentionRoutingModule
  ]
})
export class AttentionModule { }
