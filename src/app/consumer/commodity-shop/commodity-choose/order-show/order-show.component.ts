import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AccountCategory, Address, GlobalALert, GlobalFinal, Order, OrderBeforeCommodity, OrderDetail } from '../../../../dto-model/dto-model.component';
import { LocationService } from '../../../../service/location.service';
import { AddressComponent } from '../../../myspirit/set/address/address.component';
import { PayShowComponent } from '../pay-show/pay-show.component';

@Component({
  selector: 'app-order-show',
  templateUrl: './order-show.component.html',
  styleUrls: ['./order-show.component.scss'],
})
export class OrderShowComponent implements OnInit {

  orderCommoditys: Array<OrderBeforeCommodity> = new Array();
  order: Order;//订单
  orderDetails: Array<OrderDetail> = [];//订单拆分

  address: Address;//收货地址

  addShow: string = "";

  payCategory: Array<AccountCategory>;//平台账户类型

  usePaycate: number;

  totalFee: number = 0;//所有商品总计费用

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private navParams: NavParams,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    //解析参数
    this.orderCommoditys = JSON.parse(this.navParams.get("orderCommoditys"));
    this.queryAddress();
    this.queryAccountCategory();
    //计算总费用
    this.takeTotalFee();
  }

  //提交订单信息
  submitOrder() {
    if (!this.usePaycate) {
      GlobalALert.getToast("请选择支付方式");
    }
    //信息封装
    const fromdata = new FormData();
    fromdata.append("orderCommoditys", JSON.stringify(this.orderCommoditys));//订单商品信息
    fromdata.append("address", JSON.stringify(this.address));//地址直接存json字符串
    fromdata.append("orderId", this.orderCommoditys[0].orderId);//订单号，同时是隐藏令牌
    fromdata.append("payCate", this.usePaycate + "");
    //提交信息
    this.hr.post(GlobalFinal.ORDER_DOMAIN + "/order/generate", fromdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
      GlobalALert.getToast(data.msg, 1200);
      if (data.stausCode == 200) {
        //展示支付界面
        this.openPayShow(data.data.attributeName, data.data.attributeValue);
      }
    });
  }

  //展示支付页面
  async openPayShow(orderId, totalMoney: string) {
    const modal = await this.modalController.create({
      component: PayShowComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        "accaId": this.usePaycate,
        "msg": totalMoney,
        "orderId": orderId
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  //查询平台支付方式
  queryAccountCategory() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/account/category")
      .subscribe((data: any) => {
        this.payCategory = [];
        data.data.forEach((c) => {
          if (c.isOpen > 0) {
            this.payCategory.push(c);
          }
        });
      });
  }

  //修改当前的支付方式
  changeValue(event) {
    this.usePaycate = event.target.value;
  }

  //计算当前商品的总费用
  takeTotalFee() {
    this.orderCommoditys.forEach((o) => {
      this.totalFee += o.commodityNum * o.sku.skuPrice - o.shipping;
    });
  }

  //打开收货地址模态框
  async toAddress() {
    const modal = await this.modalController.create({
      component: AddressComponent,//模态框中展示的组件
      componentProps: { 'isEnabled': true },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.address = data;
    this.resolveAddress();
  }

  //请求默认收货地址
  queryAddress() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/info/addresses", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          //获取默认地址
          data.data.forEach((ad) => {
            if (ad.isDefault == 1) {
              this.address = ad;
            }
          });
          if (!this.address) {
            this.address = data.data[0];
          }
          this.resolveAddress();
        }
      });
  }

  //解析当前选中的地址
  resolveAddress() {
    //地址解析
    const ob: Observable<any> = this.locationService.parse(this.address.address.slice(0, this.address.address.lastIndexOf(" ")));
    let nowShow: string = "";
    if (ob != null) {
      ob.subscribe(([data1, data2, data3]: Array<any>) => {
        //拼接字符串
        if (data1.data.value === data2.data.value) {
          nowShow = data1.data.value + " " + data3.data.value;
        } else {
          nowShow = data1.data.value + " " + data2.data.value + " " + data3.data.value;
        }
        this.addShow = nowShow + this.address.address.slice(this.address.address.lastIndexOf(" "), this.address.address.length);
      });
    }
  }

  //关闭模态框
  dismiss() {
    this.modalController.dismiss();
  }

}
