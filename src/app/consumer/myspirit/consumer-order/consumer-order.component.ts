import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { Address, Commodity, GlobalALert, GlobalFinal, OrderBeforeCommodity, OrderDetail, Sku, SNMap, SSMap } from '../../../dto-model/dto-model.component';
import { OrderDetailComponent } from '../../../order-detail/order-detail.component';
import { LocationService } from '../../../service/location.service';
import { AddressComponent } from '../set/address/address.component';
import { CommentPublishComponent } from './comment-publish/comment-publish.component';
import { CommentShowComponent } from './comment-show/comment-show.component';

@Component({
  selector: 'app-consumer-order',
  templateUrl: './consumer-order.component.html',
  styleUrls: ['./consumer-order.component.scss'],
})
export class ConsumerOrderComponent implements OnInit {

  commentNum = 0;

  flag: number = 0;

  orders: any;

  commodityNames: Array<SSMap>;

  overTimes: Array<SNMap>;

  address: Address;//收货地址

  // pro: Promise<boolean>;

  timer;


  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private locationService: LocationService,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe((param) => {
      this.flag = parseInt(param.flag);
      switch (this.flag) {
        case 0:
          this.queryNoPay();
          break;
        case 1:
          this.queryNoTrans();
          break;
        case 2:
          this.queryNoTake();
          break;
        case 3:
          this.queryOver();
          break;
        default: {
          console.log("++++");
        }
          break;
      }
    });
    this.queryCommentCount();
  }

  back() {
    //回退上一页，开启通知
    this.navController.back();
    //location.replace("/consumer/myspirit");
  }

  // 打开评价发布模态框
  async toShowCommentPublish(index) {
    const modal = await this.modalController.create({
      component: CommentPublishComponent,
      componentProps: {
        'orderNumber': this.orders[index].orderNumber,
        'odId': this.orders[index].odId,
        'commodityId': this.orders[index].commodityId
      },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      //如果发布成功,移除数据
      this.orders.splice(index, 1);
      this.commentNum++;
    }
  }

  // 显示评价模态框
  async toShowAlreadyCommentOrder() {
    const modal = await this.modalController.create({
      component: CommentShowComponent,
      componentProps: { 'isEnabled': true },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  // 获取评价数目
  queryCommentCount() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/count/consumer/phone", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.commentNum = data.data;
      });
  }


  //获取商品名字
  getCommodityName(id) {
    //foreach不会停止，会执行多次，即使返回也会遍历完,所以会有多个返回值，导致页面显示异常。
    let name = "";
    this.commodityNames.forEach(element => {
      if (element.attributeName == id) {
        name = element.attributeValue;
      }
    });
    return name;
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
            if (this.orders.length == 0) {
              this.orders = undefined;
              //取消定时器
              this.overTrimer();
            }
          }
        }
      }
    }, 1000)
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
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/commodityName", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.commodityNames = data.data;
        }
      });
  }

  //查询未付款商品过期时间
  queryOrderDetailOverTime() {
    const ids = new Array<string>();
    this.orders.forEach((obj) => {
      ids.push(obj.orderNumber + obj.odId);
    });
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/overtime", GlobalFinal.getGetHeaderCanTakeParamJWTHeader({
      "orderDetailIds": JSON.stringify(ids)
    }))
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.overTimes = data.data;
          this.subTime();
        }
      });
  }

  //查询待付款信息
  queryNoPay() {
    this.clearData();
    this.flag = 0;
    this.addColorOnType()
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/nopay", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.orders = data.data;
          this.queryCommodityName();
          this.queryOrderDetailOverTime();
        }
      });
  }

  //查询待发货信息
  queryNoTrans() {
    this.clearData();
    this.flag = 1;
    this.addColorOnType()
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/notrans", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.orders = data.data;
          this.queryCommodityName();
        }
      });
  }

  //查询待收货信息
  queryNoTake() {
    this.clearData();
    this.flag = 2;
    this.addColorOnType()
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/notake", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.orders = data.data;
          this.queryCommodityName();
        }
      });
  }

  //查询已收货未评价信息
  queryOver() {
    this.clearData();
    this.flag = 3;
    this.addColorOnType()
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/over", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.orders = data.data;
          this.queryCommodityName();
        }
      });
  }

  //清空数据
  clearData() {
    this.orders = undefined;
    //取消定时器,否则会开启多个定时器
    this.overTrimer();
  }

  //给指定订单类型标签添加选中颜色 Array<OrderDetail>
  addColorOnType() {
    //获取被选中的节点
    const checkedNode = document.getElementsByClassName("checkedOrder")[0];
    if (checkedNode != null) {
      //先删除这个classname，注意因为这个时ionic组件会有自带的class所以我们只能截取掉我们class
      const className: any = checkedNode.getAttribute("class");
      checkedNode.setAttribute("class", className?.replace(" checkedOrder", ""));
    }
    const label = document.getElementsByClassName("orderType")[this.flag];
    label.setAttribute("class", label.getAttribute("class") + " checkedOrder");
  }

  //支付订单
  toPay(index) {
    //封装订单商品
    let orderCommoditys: Array<OrderBeforeCommodity> = new Array();
    const order: OrderDetail = this.orders[index];
    //获取商品运费
    let commodity: Commodity;
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/order/" + order.commodityId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          commodity = data.data;
          const sku = new Sku(order.commodityId, order.skuValue, order.skuMap, order.totalAmount - commodity.shipping, 0);
          const orderCommodity = new OrderBeforeCommodity(order.orderNumber, order.commodityId, this.commodityNames[index].attributeValue, sku, order.commodityNum, commodity.shipping);
          orderCommoditys.push(orderCommodity);
          //打开订单提交模态框页面
          this.openOrderModal(orderCommoditys, order.odId);
        }
      });
  }

  //跳转订单界面
  openOrderModal(orderCommoditys: Array<OrderBeforeCommodity>, odId) {
    this.router.navigate(['/consumer/shop/choose/order'],
      {
        queryParams: {
          "orderCommoditys": JSON.stringify(orderCommoditys),
          "subButtonType": 1,
          "odId": odId,
          "comeCart": false
        }
      });
  }

  //取消已经付款的订单
  chanelOrder(orderNumber, odId) {
    const formdata = new FormData();
    formdata.append("orderNumber", orderNumber);
    formdata.append("odId", odId);
    this.hr.put(GlobalFinal.ORDER_DOMAIN + "/order/notrans/chanel", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg, 1000);
        if (data.stausCode == 200) {
          this.queryNoTrans();
        }
      });
  }

  //修改订单收货地址
  modifyAddress(orderNumber, odId) {
    //选取收货地址
    this.toAddress(orderNumber, odId);
  }

  //打开收货地址模态框
  async toAddress(orderNumber, odId) {
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
    //注意这里模态框和原页面不同步，所以我们只能在这个函数中请求修改地址，否则address会没有数据
    //修改订单的收货地址
    const formdata = new FormData();
    formdata.append("address", JSON.stringify(data));
    formdata.append("orderNumber", orderNumber);
    formdata.append("odId", odId);
    this.hr.put(GlobalFinal.ORDER_DOMAIN + "/order/notrans/address", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
      GlobalALert.getToast(data.msg, 1000);
    });
  }

  //订单详情
  async orderDetailInfo(index) {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,//模态框中展示的组件
      componentProps: {
        'type': 1,
        'childType': this.flag,
        "orderNumber": this.orders[index].orderNumber,
        "odId": this.orders[index].odId,
        "commodityName": this.getCommodityName(this.orders[index].commodityId)
      },//打开模态框的类型标识
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  //查看订单物流信息
  showOrderLogstic(orderNumber, odId) {

  }

  //确认订单收货
  async sureOrderOver(orderNumber, odId) {
    //确认操作
    const data = await GlobalALert.getSureAlert("确认收货");
    if (data == 'confirm') {
      //执行确认收货请求
      const formdata = new FormData();
      formdata.append("orderNumber", orderNumber);
      formdata.append("odId", odId);
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/order/suerOver", formdata, GlobalFinal.JWTHEADER)
        .subscribe((data: any) => {
          GlobalALert.getToast(data.msg);
          this.queryNoTake();
        });
    }
  }
}
