import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'favorable '
})
export class FavorablePipe implements PipeTransform {
  constructor() { }
  transform(favorableRate: number): any {
    return (parseInt(favorableRate + "")) + "%";
  }
}
