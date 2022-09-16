import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalFinal, OrderDetail, SNMap } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-consumer-order',
  templateUrl: './consumer-order.component.html',
  styleUrls: ['./consumer-order.component.scss'],
})
export class ConsumerOrderComponent implements OnInit {

  flag: number = 0;

  orders: Array<OrderDetail>;

  commodityNames: Array<string>;

  overTimes: Array<SNMap>;

  timer;

  constructor(
    private router: Router,
    private hr: HttpClient,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    //解析参数
    this.activatedRoute.params.subscribe((data) => {
      this.flag = data.flag;
    });
    this.queryNoPay();
  }

  back() {
    this.modalController.dismiss();
  }

  //定时减少时间
  subTime() {
    this.timer = setInterval(() => {
      if (this.overTimes) {
        if (this.orders.length == 0) {
          //取消定时器
          this.overTrimer();
        }
        for (let i = 0; i < this.overTimes.length; i++) {
          this.overTimes[i].value--;
          if (this.overTimes[i].value <= 0) {
            this.overTimes.splice(i, 1);
            this.orders.splice(i, 1);
          }
        }
      }
    }, 1500)
  }

  //定时器取消
  overTrimer() {
    clearInterval(this.timer);
  }

  // 查询商品名称
  queryCommodityName() {
    const ids = new Array<string>();
    this.orders.forEach((obj) => {
      ids.push(obj.commodityId);
    });
    const formdata = new FormData();
    formdata.append("ids", JSON.stringify(ids));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/commodityName", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.commodityNames = data.data;
        }
      });
  }

  //查询未付款商品过期时间
  queryOrderDetailOverTime() {
    const ids = new Array<string>();
    this.orders.forEach((obj) => {
      ids.push(obj.commodityId);
    });
    const formdata = new FormData();
    formdata.append("ids", JSON.stringify(ids));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/commodityName", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.commodityNames = data.data;
          this.subTime();
        }
      });
  }

  //查询待付款信息
  queryNoPay() {
    this.flag = 0;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/nopay", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.orders = data.data;
          this.queryCommodityName();
        }
      });
  }

  //查询待发货信息
  queryNoTrans() {
    this.flag = 1;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/notrans", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.orders = data.data;
          this.queryCommodityName();
          this.queryOrderDetailOverTime();
        }
      });
  }

  //查询待收货信息
  queryNoTake() {
    this.flag = 2;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/notake", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.orders = data.data;
          this.queryCommodityName();

        }
      });
  }

  //查询已收货信息
  queryOver() {
    this.flag = 3;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/over", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.orders = data.data;
          this.queryCommodityName();
        }
      });
  }

}
