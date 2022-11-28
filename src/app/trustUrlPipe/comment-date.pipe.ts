import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'commentDate'
})
export class CommentDatePipe implements PipeTransform {
  constructor() { }
  transform(date: number): any {
    const endDate = new Date();
    const startDate = new Date(date);
    let result = "发布于";
    //当前相差年
    const year = endDate.getFullYear() - startDate.getFullYear();
    if (year > 0) {
      return result + year + "年前";
    } else {
      //当前相差月
      const month = endDate.getMonth() - startDate.getMonth();
      if (month > 0) {
        return result + month + "月前";
      } else {
        //当前相差日
        const day = endDate.getDate() - startDate.getDate();
        if (day > 0) {
          return result + day + "天前";
        } else {
          //当前相差时
          const hour = endDate.getFullYear() - startDate.getFullYear();
          if (hour > 0) {
            return result + hour + "小时前";
          } else {
            //当前相差分
            const minute = endDate.getFullYear() - startDate.getFullYear();
            if (minute > 0) {
              return result + minute + "分钟前";
            } else {
              return result + "1分钟前";
            }
          }
        }
      }
    }
  }
}
