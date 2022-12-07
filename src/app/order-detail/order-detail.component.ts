import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @Input() type = 0;//商家端0，买家端1，平台2
  @Input() childType = 0;//未付款0，已付款1，已发货2，已收货3，已评价4
  @Input() orderNumber = "";
  @Input() odId = 0;
  @Input() commodityName = "";//商品名

  orderInfo;//订单信息

  cpi;//付款信息

  pts;//平台转账信息

  consumerInfo;//买家信息

  storeInfo;//店铺信息

  address;//收货地址

  addressLocation;//地址信息



  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    switch (this.type) {
      case 0: {
        this.queryOrderInfo(GlobalFinal.STORE_HEADER);
      }; break;
      case 1: {
        this.queryOrderInfo(GlobalFinal.JWTHEADER);
      } break;
    }
    if (this.childType > 0) {
      this.queryCpi();
    }
    if (this.childType > 2) {
      this.queryPts();
    }
  }

  //退出模态框
  dismiss() {
    this.modalController.dismiss();
  }

  //复制文字到剪切板
  copy() {
    GlobalALert.getToast("已复制");
  }

  // 查询订单信息
  queryOrderInfo(head) {
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/orderDetailInfo/" + this.orderNumber + "/" + this.odId, head)
      .subscribe((data: any) => {
        if (data.stausCode == 300) {
          GlobalALert.getToast(data.msg);
          return;
        }
        if (data.stausCode == 200) {
          this.orderInfo = data.data;
          //解析收货地址信息
          this.address = JSON.parse(data.data.addressMsg);
          this.transform(this.address.address);
          if (this.type === 0) {
            this.queryConsumerInfo();
          }
          if (this.type === 1) {
            this.queryStoreInfo();
          }
        }
      });
  }

  //解析收货地址
  transform(location: string): any {
    this.addressLocation = " " + location.split(" ")[1];
    if (GlobalFinal.IS_EXIST.includes(location) || location.length <= 0) {
      return "";
    }
    let array: Array<number>;
    try {
      array = JSON.parse(location);
    } catch {
      location = location.slice(0, location.indexOf(" "));
      array = JSON.parse(location);
    }
    //创建一个可观察对象数组
    const arr = [
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER),
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
    ];
    forkJoin(arr).subscribe(([data1, data2, data3]: Array<any>) => {
      //拼接字符串
      if (data1.data.value === data2.data.value) {
        this.addressLocation = data1.data.value + " " + data3.data.value + this.addressLocation;
      } else {
        this.addressLocation = data1.data.value + " " + data2.data.value + " " + data3.data.value + this.addressLocation;
      }
    });
  }

  //查询买家信息
  queryConsumerInfo() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/headAndName/simple/" + this.orderInfo.consumerPhone, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.consumerInfo = data.data;
      });
  }

  //查询店铺信息
  queryStoreInfo() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + this.orderInfo.storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.storeInfo = data.data;
      });
  }

  //查询付款信息
  queryCpi() {
    let head = GlobalFinal.JWTHEADER;
    if (this.type == 0) {
      head = GlobalFinal.STORE_HEADER;
    }
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/payinfo/cpi/" + this.orderNumber + this.odId, head)
      .subscribe((data: any) => {
        this.cpi = data.data;
      });
  }

  //查询转账信息
  queryPts() {
    let head = GlobalFinal.JWTHEADER;
    if (this.type == 0) {
      head = GlobalFinal.STORE_HEADER;
    }
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/payinfo/pts/" + this.orderNumber + this.odId, head)
      .subscribe((data: any) => {
        this.pts = data.data;
      });
  }

}
