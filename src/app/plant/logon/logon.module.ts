import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CodeInputModule } from 'angular-code-input';
import { CodeInputComponent } from './code-input/code-input.component';
import { LogonRoutingModule } from './logon-routing.module';
import { LogonComponent } from './logon.component';



@NgModule({
  declarations: [
    LogonComponent,
    CodeInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    LogonRoutingModule,
    CodeInputModule
  ]
})
export class LogonModule { }
