import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AccountCategory, Address, GlobalALert, GlobalFinal, Order, OrderBeforeCommodity, OrderDetail, SSMap } from '../../../../dto-model/dto-model.component';
import { LocationService } from '../../../../service/location.service';
import { AddressComponent } from '../../../myspirit/set/address/address.component';

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

  subButtonType: number = 0;//如果是0显示提交订单，如果是1显示支付按钮

  odId;//用于未付款商品单独付款时指定的订单细节编号，只有这种情况我们需要明确指定细节编号，如果是浏览时进行下单支付，那么必然是0

  comeCart: boolean = false;//来自购物车
  cartIds;//购物车商品id

  constructor(
    private hr: HttpClient,
    private rou: Router,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    //解析参数
    this.activatedRoute.queryParams.subscribe(data => {
      this.orderCommoditys = JSON.parse(data.orderCommoditys);
      this.subButtonType = parseInt(data.subButtonType);
      if (data.odId) {
        this.odId = data.odId;
      }

      this.comeCart = data.comeCart == 'false' ? false : true;
      if (this.comeCart) {
        this.cartIds = JSON.parse(data.cartIds);
      }
      this.queryAddress();
      this.queryAccountCategory();
      //计算总费用
      this.takeTotalFee();
    });
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
        //删除购物车商品
        if (this.comeCart) {
          for (let i = 0; i < this.cartIds.length; i++) {
            const formdata = new FormData();
            formdata.append("cartId", this.cartIds[i] + "");
            this.hr.put(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => { })
          }
        }
        //如果下单成功，就向服务端请求支付界面拉取所需的支付数据
        this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/pay/detail/" + this.usePaycate + "/" + data.data.attributeName + "/0", GlobalFinal.JWTHEADER)
          .subscribe((param: any) => {
            GlobalALert.getToast("正在跳转支付界面", 1200);
            //将数据拉取后通过前端支付插件拉取，这里我们模拟支付界面
            //将字符串转化为SSMAP类
            const temp: SSMap = JSON.parse(param.data);
            this.openPayShow(temp.attributeName, temp.attributeValue);
          });
      }
    });
  }

  //只调用付款
  submitPay() {
    //如果支付单个商品进行支付
    if (this.orderCommoditys.length > 1) {
      this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/pay/together/" + this.usePaycate + "/" + this.orderCommoditys[0].orderId, GlobalFinal.JWTHEADER)
        .subscribe((param: any) => {
          GlobalALert.getToast("正在跳转支付界面", 1200);
          //将数据拉取后通过前端支付插件拉取，这里我们模拟支付界面
          //将字符串转化为SSMAP类
          const temp: SSMap = JSON.parse(param.data);
          this.openPayShow(temp.attributeName, temp.attributeValue);
        });
    }
    if (this.orderCommoditys.length == 1) {
      this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/pay/detail/" + this.usePaycate + "/" + this.orderCommoditys[0].orderId + "/" + this.odId, GlobalFinal.JWTHEADER)
        .subscribe((param: any) => {
          GlobalALert.getToast("正在跳转支付界面", 1200);
          //将数据拉取后通过前端支付插件拉取，这里我们模拟支付界面
          //将字符串转化为SSMAP类
          const temp: SSMap = JSON.parse(param.data);
          this.openPayShow(temp.attributeName, temp.attributeValue);
        });
    }
  }

  //展示支付页面
  openPayShow(orderId, totalMoney) {
    //跳转支付页面
    this.rou.navigate(['/consumer/shop' + '/choose' + '/pay-show'], {
      queryParams: {
        "accaId": this.usePaycate,
        "msg": totalMoney,
        "orderId": orderId
      }
    });
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
      this.totalFee += (o.commodityNum * o.sku.skuPrice) + parseFloat(o.shipping + "");
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
    this.navController.back();
  }

}
