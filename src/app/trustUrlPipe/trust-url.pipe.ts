import { Pipe, PipeTransform } from '@angular/core';
import { GlobalFinal } from '../dto-model/dto-model.component';
// https://angular.cn/api/platform-browser/DomSanitizer
@Pipe({
  name: 'trustUrl'
})
export class TrustUrlPipe implements PipeTransform {
  constructor() { }
  transform(url: string): any {
    //如果是本地图片地址，就直接返回
    if (url.includes(GlobalFinal.NODE_DOMAIN)) {
      return url;
    }
    // 允许通过不安全的 url
    return GlobalFinal.FILE_DOMAIN + url;
  }
}
