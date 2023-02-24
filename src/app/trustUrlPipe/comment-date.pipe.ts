import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'commentDate'
})
export class CommentDatePipe implements PipeTransform {
  constructor() { }
  transform(date: number): any {
    const endDate = new Date();
    const startDate = new Date(date);
    const showUnity = [0, 0, 0, 0, 0];
    let result = "发布于";
    //当前相差年
    const year = endDate.getFullYear() - startDate.getFullYear();
    if (year > 0) {
      //如果相差年份大于1，再计算月份相差是否符合
      if (endDate.getMonth() > startDate.getMonth()) {
        showUnity[0] = year;
      } else {
        //如果结束月份小于开始月份
        //如果相差不足一年就返回相差月
        if (year == 1) {
          showUnity[1] = 12 - (startDate.getMonth() - endDate.getMonth());
        } else {
          showUnity[0] = year - 1;
        }
      }
    } else {
      //如果是同年发布，计算相差月
      const month = endDate.getMonth() - startDate.getMonth();
      //如果不同月
      if (month > 0) {
        showUnity[1] = month;
      } else {
        //如果同月发布，计算相差日
        const day = endDate.getDate() - startDate.getDate();
        //如果不同天发布
        if (day > 0) {
          showUnity[2] = day;
        } else {
          //如果同天发布，计算相差小时
          const hour = endDate.getHours() - startDate.getHours();
          //如果不同小时
          if (hour > 0) {
            showUnity[3] = hour;
          } else {
            //如果同小时，计算相差分
            const minute = endDate.getMinutes() - startDate.getMinutes();
            //如果不同分
            if (minute > 0) {
              showUnity[4] = minute;
            } else {
              //如果同分
              return showUnity[4] = 1;
            }
          }
        }
      }
    }
    //扫描展示最终结果
    for (let i = 0; i < showUnity.length; i++) {
      if (showUnity[i] > 0) {
        switch (i) {
          case 0: return result + showUnity[i] + "年前"; break;
          case 1: return result + showUnity[i] + "个月前"; break;
          case 2: return result + showUnity[i] + "天前"; break;
          case 3: return result + showUnity[i] + "小时前"; break;
          case 4: return result + showUnity[i] + "分前"; break;
        }
      }
    }
  }
}
