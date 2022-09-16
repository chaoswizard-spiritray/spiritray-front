import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'timepipe'
})
export class TimePipe implements PipeTransform {
  constructor() { }
  transform(value: number): any {
    const mi = value / 60;
    const se = value % 60;
    return mi + ":" + se;
  }
}
