import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountCategory, GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-pay-method',
  templateUrl: './pay-method.component.html',
  styleUrls: ['./pay-method.component.scss'],
})
export class PayMethodComponent implements OnInit {
  cates: Array<AccountCategory>;

  constructor(
    private hr: HttpClient
  ) { }

  ngOnInit() {
    this.queryAccountCate();
  }

  //请求平台支付种类
  queryAccountCate() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/account/category", GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.cates = data.data;
      });
  }

  //开闭支付方式
  modify(event, cate: AccountCategory) {
    if (cate.isOpen) {
      cate.isOpen = 1;
    } else {
      cate.isOpen = 0;
    }
    //修改支付方式状态
    const formdata = new FormData();
    formdata.append("cate", JSON.stringify(cate));
    this.hr.put(GlobalFinal.PLANT_DOMAIN + "/plant/account/category", formdata, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
      })
  }
}
