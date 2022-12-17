import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'chinadatepipe'
})
export class ChinaDatePipe implements PipeTransform {
  constructor() { }
  transform(date: number): any {
    const newDate = new Date(date);
    return newDate.getFullYear() + "年" + (newDate.getMonth() + 1) + "月" + newDate.getDate()
      + "日";
  }
}
