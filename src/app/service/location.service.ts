import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Address, GlobalFinal } from '../dto-model/dto-model.component';

@Injectable(
  {
    providedIn: "root"
  }
)
export class LocationService {
  addresses: Array<Address>;
  addressFirstShow: Array<string> = [""];
  addressLastShow: Array<string> = [""];
  constructor(
    private hr: HttpClient,
  ) { }

  //解析值
  parse(location: string): Observable<Object> {
    if (GlobalFinal.IS_EXIST.includes(location) || location.length <= 0) {
      return null;
    }
    //看是否只有数组信息
    let i = location.lastIndexOf(" ");
    if (i > -1) {
      location = location.slice(0, i);
    }
    let array: Array<number> = JSON.parse(location);
    //创建一个可观察对象数组
    const arr = [
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
    ];
    return forkJoin(arr);
  }
}
