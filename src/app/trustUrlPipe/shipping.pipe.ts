import { Pipe, PipeTransform } from '@angular/core';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'shippingpipe'
})
export class ShippingPipe implements PipeTransform {
  constructor() { }
  transform(shipping: number): any {
    if (shipping == 0) {
      return "免运费";
    } else {
      return shipping + "元";
    }

  }
}
