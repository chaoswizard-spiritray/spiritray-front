import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, ModalController, NavController } from '@ionic/angular'
import { Cart, GlobalALert, GlobalFinal, GlobalFlagShow, OrderBeforeCommodity, SSMap } from '../../dto-model/dto-model.component';
import { OrderShowComponent } from '../commodity-shop/commodity-choose/order-show/order-show.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  totalMoney = 0;

  indexs: Array<number> = [];//选中的下标
  // 购物车中的数据
  commoditys: Array<Cart>;

  shipping = 0;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.queryCart();
  }

  //查询购物车商品信息
  searchcommodity(word) {
    const data = new Array<Cart>();
    this.commoditys.forEach((cart) => {
      console.log("-----------");

      if (cart.commodityName.includes(word)) {
        data.push(cart);
      }
    });
    this.commoditys = data;
  }

  //刷新数据
  refreshing(event) {
    let time = 1000;
    //只显示加载图标
    this.queryCart();
    setTimeout(() => { event.target.complete(); }, 1500);
  }


  //查询是否选取
  check(event, isAll, index) {
    const tr = event.target;
    if (isAll == 1) {
      const els = document.getElementsByTagName("ion-checkbox");
      for (let i = 0; i < els.length - 1; i++) {
        if (tr.checked) {
          els[i].checked = true;
        } else {
          els[i].checked = false;
        }
      }
    } else {
      //因为每次改变就会让其发生变化，所以全选不用再进行计算
      if (tr.checked) {
        this.totalMoney += this.commoditys[index].totalFee;
      } else {
        this.totalMoney -= this.commoditys[index].totalFee;
      }
    }
  }

  //查询购物车信息
  queryCart() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.data != null) {
        this.commoditys = data.data;
      }
    });
  }

  //清空购物车
  clearCart() {
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/cart/clear", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      // GlobalALert.getToast(data.msg);
      if (data.stausCode == 200) {
        this.commoditys = undefined;
      }
    });
    GlobalALert.getToast("购物车已清空");
    this.commoditys = undefined;
  }

  //跳转商品展示界面
  toCommodityShop(commodityId) {
    this.router.navigateByUrl("/consumer/shop/" + commodityId);
  }

  //删除指定的购物车记录
  deleteCart(index) {
    const formdata = new FormData();
    formdata.append("cartId", this.commoditys[index].cartId + "");
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
      GlobalALert.getToast(data.msg);
      if (data.stausCode == 200) {
        this.commoditys.splice(index, 1);
      }
    });
  }

  //选择购物车信息
  chooseCart(index) {
    if (!this.indexs) {
      this.indexs = [];
    }
    this.indexs.push(index);
  }

  //去下单界面
  toOrder() {
    if ((this.indexs.length == 0)) {
      GlobalALert.getToast("没有选择商品");
      return;
    }
    const pa = new Array<SSMap>();
    this.commoditys.forEach((c) => {
      let s = new SSMap(c.commodityId, c.skuValue);
      pa.push(s);
    });
    const da = new FormData();
    da.append("commodities", JSON.stringify(pa));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/sku/checkorder", da, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.generateOrder(data.data);
        }
      });

  }


  //获取订单令牌,防止订单重复提交
  generateOrder(skus): any {
    let orderId: string;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/token", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.stausCode != 200) {
          GlobalALert.getToast("服务异常，请稍后再试", 1000);
          return;
        } else {
          orderId = data.data;
        }
        //封装订单商品列表
        let orderCommoditys: Array<OrderBeforeCommodity> = new Array();
        for (let i = 0; i < this.indexs.length; i++) {
          let orderCommodity = new OrderBeforeCommodity(orderId, this.commoditys[i].commodityId, this.commoditys[i].commodityName, skus[i], this.commoditys[i].commodityNum, 0);
          orderCommoditys.push(orderCommodity);
        }
        //打开订单提交模态框页面
        this.openOrderModal(orderCommoditys);
      });
  }

  //打开订单模态框
  async openOrderModal(orderCommoditys: Array<OrderBeforeCommodity>) {
    const modal = await this.modalController.create({
      component: OrderShowComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        "orderCommoditys": JSON.stringify(orderCommoditys)
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }


}
