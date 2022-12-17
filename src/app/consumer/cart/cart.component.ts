import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Cart, GlobalALert, GlobalFinal, OrderBeforeCommodity, SSMap } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  totalMoney = 0;

  hiddenData = true;

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

  }

  ionViewWillEnter() {
    this.queryCart();
  }

  ionViewDidEnter() {
    this.queryCart();
  }

  ionViewWillLeave() {
    this.indexs = [];
    this.totalMoney = 0;
  }

  //查询购物车商品信息
  searchcommodity(word) {
    const data = new Array<Cart>();
    this.commoditys.forEach((cart) => {
      if (cart.commodityName.includes(word) || cart.cartId.toString().includes(word) || cart.skuValue.includes(word) || cart.commodityNum.toString().includes(word) || cart.totalFee.toString().includes(word)) {
        data.push(cart);
      }
    });
    this.commoditys = data;
  }

  //刷新数据
  refreshing(event) {
    this.clearCheckData();
    let time = 1000;
    //只显示加载图标
    this.queryCart();
    setTimeout(() => { event.target.complete(); }, 1500);
  }

  //重新加载
  reLoad() {
    this.clearCheckData();
    this.queryCart();
  }

  //清除选中的数据
  clearCheckData() {
    this.indexs = [];
    this.totalMoney = 0;
  }


  //查询是否选取
  check(event, isAll, index) {
    const tr = event.target;
    if (isAll == 1) {
      const els = document.getElementsByTagName("ion-checkbox");
      for (let i = 0; i < els.length - 1; i++) {
        if (tr.checked) {
          this.indexs[i] = i;
          els[i].checked = true;
        } else {
          this.indexs = [];
          els[i].checked = false;
        }
      }
    } else {
      //因为每次改变就会让其发生变化，所以全选不用再进行计算
      if (tr.checked) {
        this.indexs.push(index);
        this.totalMoney += this.commoditys[index].totalFee;
      } else {
        for (let i = 0; i < this.indexs.length; i++) {
          if (this.indexs[i] == index) {
            this.indexs.splice(i, 1);
          }
        }
        this.totalMoney -= this.commoditys[index].totalFee;
      }
    }
  }

  //查询购物车信息
  queryCart() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.data != null) {
        this.commoditys = data.data;
        if (this.commoditys && this.commoditys.length > 0) {
          this.hiddenData = false;
        }
      }
    });
  }

  //清空购物车
  async clearCart() {
    if (await GlobalALert.getSureAlert("确认清空购物车吗？") == 'confirm') {
      this.hr.put(GlobalFinal.DOMAIN + "/consumer/cart/clear", null, GlobalFinal.JWTHEADER).subscribe((data: any) => {
        if (data.stausCode == 200) {
          GlobalALert.getToast("购物车已清空");
          this.commoditys = new Array();
          this.hiddenData = true;
        } else {
          GlobalALert.getToast("清空失败");
        }
      });
    }
  }

  //跳转商品展示界面
  toCommodityShop(commodityId) {
    this.router.navigate(['/consumer/shop'], {
      queryParams: {
        'commodityId': commodityId
      }
    });
  }

  //删除指定的购物车记录
  async deleteCart() {
    if (this.indexs.length == 0) {
      GlobalALert.getAlert({ 'message': "没有选取商品" });
      return;
    }
    if (this.indexs.length == this.commoditys.length) {
      this.clearCart();
    } else {
      if (await GlobalALert.getSureAlert("确定删除吗？") == 'confirm') {
        for (let i = 0; i < this.indexs.length; i++) {
          const formdata = new FormData();
          formdata.append("cartId", this.commoditys[this.indexs[i]].cartId + "");
          this.hr.put(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
            if (data.stausCode == 200) {
              this.commoditys.splice(this.indexs[i], 1);
              if (!this.commoditys || this.commoditys.length == 0) {
                this.hiddenData = true;
              }
              if (i == this.indexs.length - 1) {
                this.indexs = [];
                GlobalALert.getAlert({ "message": "删除成功" });
              }
            }
          });
        }
      }
    }
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
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/sku/checkorder", da, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.generateOrder(data.data);
        }
      });

  }


  //获取订单令牌,防止订单重复提交
  generateOrder(skus): any {
    let orderId: string;
    const ids = new Array();
    this.commoditys.forEach(el => {
      ids.push(el.commodityId);
    });
    const head = {
      headers: GlobalFinal.JWTHEADER.headers,
      params: {
        "commodityIds": JSON.stringify(ids)
      },
      withCredentials: GlobalFinal.JWTHEADER.withCredentials
    }
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/token", head)
      .subscribe((data: any) => {
        if (data.stausCode != 200) {
          GlobalALert.getToast("服务异常，请稍后再试", 1000);
          return;
        } else {
          orderId = data.data;
        }
        //封装订单商品列表
        let orderCommoditys: Array<OrderBeforeCommodity> = new Array();
        //获取商品的cartId
        const cartIds: any = [];
        for (let i = 0; i < this.indexs.length; i++) {
          let orderCommodity = new OrderBeforeCommodity(orderId, this.commoditys[this.indexs[i]].commodityId, this.commoditys[this.indexs[i]].commodityName, skus[this.indexs[i]], this.commoditys[this.indexs[i]].commodityNum, 0);
          orderCommoditys.push(orderCommodity);
          cartIds.push(this.commoditys[this.indexs[i]].cartId);
        }
        //打开订单提交模态框页面
        this.openOrderModal(orderCommoditys, cartIds);
      });
  }

  //打开订单
  openOrderModal(orderCommoditys: Array<OrderBeforeCommodity>, cartIds: any) {
    this.router.navigate(['/consumer/shop/choose/order'],
      {
        queryParams: {
          "orderCommoditys": JSON.stringify(orderCommoditys),
          "subButtonType": 0,
          "comeCart": true,
          "cartIds": JSON.stringify(cartIds)
        }
      });
  }


}
