import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'datenotimepipe'
})
export class DateNotimePipe implements PipeTransform {
  constructor() { }
  transform(date: number): any {
    const newDate = new Date(date);
    return newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
  }
}
