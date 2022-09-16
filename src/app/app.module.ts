import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeforeStoreComponent } from './before-store/before-store.component';
import { DtoModelComponent } from './dto-model/dto-model.component';
import { ErrorComponent } from './error/error.component';




@NgModule({
  declarations:
    [
      AppComponent,
      ErrorComponent,
      DtoModelComponent,
      BeforeStoreComponent
    ],
  entryComponents: [],
  imports:
    [
      CommonModule,
      BrowserModule,
      FormsModule,
      HammerModule,
      IonicModule.forRoot(),
      HttpClientModule,
      AppRoutingModule
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
