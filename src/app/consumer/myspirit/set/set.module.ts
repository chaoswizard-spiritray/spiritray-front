import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { DetailShowComponent } from '../../../business/detail-show/detail-show.component';
import { PositionComponent } from '../../../position/position.component';
import { LocationService } from '../../../service/location.service';
import { PositionService } from '../../../service/position.service';
import { LocationPipe } from '../../../trustUrlPipe/location.pipe';
import { SexPipe } from '../../../trustUrlPipe/sex.pipe';
import { TrustUrlPipe } from '../../../trustUrlPipe/trust-url.pipe';
import { AddressMenuComponent } from './address/address-menu/address-menu.component';
import { AddressComponent } from './address/address.component';
import { InfComponent } from './inf/inf.component';
import { ModifyNicknameComponent } from './inf/modify-nickname/modify-nickname.component';
import { ModifySexComponent } from './inf/modify-sex/modify-sex.component';
import { SetRoutingModule } from './set-routing.module';
import { SetComponent } from './set.component';



@NgModule({
  declarations: [
    SetComponent,
    InfComponent,
    AddressComponent,
    TrustUrlPipe,
    SexPipe,
    LocationPipe,
    ModifyNicknameComponent,
    ModifySexComponent,
    DetailShowComponent,
    AddressMenuComponent,
    PositionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HammerModule,
    IonicModule,
    HttpClientModule,
    SetRoutingModule
  ],
  providers: [
    { provide: 'locationService', useClass: LocationService },
    { provide: 'positionService', useClass: PositionService }
  ]
})
export class SetModule { }
