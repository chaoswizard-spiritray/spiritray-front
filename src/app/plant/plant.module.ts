import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { PlantRoutingModule } from './plant-routing.module';
import { PlantComponent } from './plant.component';



@NgModule({
  declarations: [
    PlantComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    PlantRoutingModule
  ]
})
export class PlantModule { }
