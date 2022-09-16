import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'sex'
})
export class SexPipe implements PipeTransform {
  constructor() { }
  transform(sex: number): any {
    if (sex == 0) {
      return "男";
    }
    if (sex == 1) {
      return "女";
    }
  }
}
