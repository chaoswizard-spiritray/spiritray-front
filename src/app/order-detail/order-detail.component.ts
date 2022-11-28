import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
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
          if (this.type === 0) {
            this.queryConsumerInfo();
          }
          if (this.type === 1) {
            this.queryStoreInfo();
          }
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
        console.log(data);

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
