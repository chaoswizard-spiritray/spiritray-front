import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GlobalFinal } from '../dto-model/dto-model.component';
import { LocationService } from '../service/location.service';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'parselocation'
})
export class LocationPipe implements PipeTransform {
  result: string = "";
  trimer;
  constructor(
    private hr: HttpClient,
    private locationService: LocationService
  ) { }

  transform(location: string): any {
    if (GlobalFinal.IS_EXIST.includes(location) || location.length <= 0) {
      return "";
    }
    let array: Array<number>;
    try {
      array = JSON.parse(location);
    } catch {
      location = location.slice(0, location.indexOf(" "));
      array = JSON.parse(location);
    }
    //创建一个可观察对象数组
    const arr = [
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
    ];
    forkJoin(arr).subscribe(([data1, data2, data3]: Array<any>) => {
      //拼接字符串
      if (data1.data.value === data2.data.value) {
        this.result = data1.data.value + " " + data3.data.value;
      } else {
        this.result = data1.data.value + " " + data2.data.value + " " + data3.data.value;
      }
    });
  }
}
