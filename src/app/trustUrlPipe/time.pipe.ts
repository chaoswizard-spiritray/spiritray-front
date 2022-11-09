import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'timepipe'
})
export class TimePipe implements PipeTransform {
  constructor() { }
  transform(value: number): any {
    const mi = Math.floor(value / 60);
    const se = value % 60;
    let str = "00:";
    str = str + (mi < 10 ? "0" + mi : mi) + ":" + (se < 10 ? "0" + se : se);
    return str;
  }
}
