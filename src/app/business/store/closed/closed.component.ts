import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GlobalALert, GlobalFinal, Store } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-closed',
  templateUrl: './closed.component.html',
  styleUrls: ['./closed.component.scss'],
})
export class ClosedComponent implements OnInit {
  //店铺关闭信息
  storeCloseInf: Store;

  constructor(private hr: HttpClient) {

  }

  ngOnInit() {
    this.queryStoreCloseInf();
  }

  //关闭店铺
  close() {
    let formdata = new FormData();
    let obj: any = document.getElementsByClassName("closeCause")[0];
    formdata.append("causeInf", obj.value);
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/storeInf/status/down", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        location.reload();
      });
  }

  //加载店铺关闭信息
  queryStoreCloseInf() {
    this.hr
      .get(GlobalFinal.SELLER_DOMAIN + "/store/closeInf", GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        // GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          //查询成功就将数据进行绑定
          this.storeCloseInf = data.data;
        }
      });
  }
}
