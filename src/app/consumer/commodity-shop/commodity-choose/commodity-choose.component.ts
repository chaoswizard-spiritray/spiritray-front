import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Cart, GlobalALert, GlobalFinal, OrderBeforeCommodity, Sku, SSMap } from '../../../dto-model/dto-model.component';
import { ImgShowComponent } from '../../../img-show/img-show.component';

@Component({
  selector: 'app-commodity-choose',
  templateUrl: './commodity-choose.component.html',
  styleUrls: ['./commodity-choose.component.scss'],
})
export class CommodityChooseComponent implements OnInit {
  //组件传递的基本参数
  commodityId: string;

  comIndex: number = 0;

  shipping: number;

  commodityName: string;

  //当前选取sku,存储的是数组下标
  sku: Array<number>;

  //每级选中的元素引用
  attributeRef: Array<any> = new Array();

  //选取数量
  commodityNum: number = 0;

  //总计费用
  totalFee = 0;

  //当前选取sku的id
  nowIndex = 0;

  //当前客户可选属性
  mulCavs: Array<Array<string>>;
  attributeNames: Array<SSMap>;
  //当前商品的sku
  skus: Array<Sku>;


  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    //解析参数
    this.activatedRoute.queryParams.subscribe(data => {
      //保存参数值
      this.commodityId = data.commodityId;
      this.comIndex = data.comIndex;
      this.shipping = data.shipping;
      this.commodityName = data.commodityName;
      //请求参数值
      this.querySku();
      this.queryMulAttribute();
    });
  }

  //加入购物车
  addCart() {
    //检测信息是否选取
    if (this.commodityNum == 0) {
      GlobalALert.getToast("请选取数量");
    }
    //封装信息
    const cart = new Cart(0, this.commodityId, null, this.commodityName, this.commodityNum, this.skus[this.nowIndex].skuValue, this.skus[this.nowIndex].skuMap, this.totalFee);
    const fromdata = new FormData();
    fromdata.append("cart", JSON.stringify(cart));
    this.hr.post(GlobalFinal.DOMAIN + "/consumer/cart/commoditys", fromdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
      });
  }

  //去下单界面
  toOrder() {
    if (this.commodityNum <= 0) {
      GlobalALert.getToast("无法下单");
      return;
    }
    this.generateOrder();
  }

  //获取订单令牌,防止订单重复提交
  generateOrder(): any {
    let orderId = "";
    const ids = new Array();
    ids.push(this.commodityId);
    const head = {
      headers: GlobalFinal.JWTHEADER.headers,
      params: {
        "commodityIds": JSON.stringify(ids)
      },
      withCredentials: GlobalFinal.JWTHEADER.withCredentials
    }
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/token", head)
      .subscribe((data: any) => {
        //如果商品已下架直接跳转首页
        if (data.stausCode == 400) {
          GlobalALert.getAlert({ message: data.msg });
          this.router.navigate(["/consumer"]);
        }
        if (data.stausCode == 200) {
          orderId = data.data;
        }
        //封装订单商品
        let orderCommoditys: Array<OrderBeforeCommodity> = new Array();
        const orderCommodity = new OrderBeforeCommodity(orderId, this.commodityId, this.commodityName, this.skus[this.nowIndex], this.commodityNum, this.shipping);
        orderCommoditys.push(orderCommodity);
        //打开订单提交模态框页面
        this.openOrderModal(orderCommoditys);
      });
  }

  //跳转订单界面
  openOrderModal(orderCommoditys: Array<OrderBeforeCommodity>) {
    console.log(orderCommoditys);

    this.router.navigate(['/consumer/shop/choose/order'],
      {
        queryParams: {
          "orderCommoditys": JSON.stringify(orderCommoditys),
          "subButtonType": 0,
          "comeCart": false
        }
      });
  }


  //减少
  sub() {
    if (this.commodityNum > 1) {
      this.commodityNum--;
      this.totalFee = this.commodityNum * this.skus[this.nowIndex].skuPrice;
    }
  }

  //增加
  add() {
    let num = this.skus[this.nowIndex].num > 9 ? 9 : this.skus[this.nowIndex].num;
    if (this.commodityNum < num) {
      this.commodityNum++;
      this.totalFee = this.commodityNum * this.skus[this.nowIndex].skuPrice;
    }
  }

  //是否是颜色
  isColor(name: string): boolean {
    return name.includes("颜色");
  }

  //通过属性名获取属性值数组
  getValueList() {
    let i = 0;
    this.mulCavs = [];
    this.attributeNames.forEach((v) => {
      this.mulCavs.push(v.attributeValue.split(","));
    });
  }

  //解析sku的id
  resolveNow() {
    let str = "";
    let i = 0;
    this.sku.forEach((n) => {
      const lis = this.attributeNames[i].attributeValue.split(",");
      if (i == 0) {
        str = lis[n];
      } else {
        str += "+" + lis[n];
      }
      i++;
    });
    i = 0;
    this.skus.forEach((sk) => {
      if (sk.skuValue == str) {
        this.nowIndex = i;
        return;
      }
      i++;
    });
    this.modifyTotalFee();
  }

  //更新总费用
  modifyTotalFee() {
    this.totalFee = this.skus[this.nowIndex].skuPrice * this.commodityNum;
  }

  //选取数组
  checkCav(event, mulIndex: number, valueIndex: number) {
    //清除选取的数量
    this.commodityNum = 0;
    //清除上次选取的元素
    let el = this.attributeRef[mulIndex];
    const s = "" + el.getAttribute("class");
    el.setAttribute("class", s.replace(" select", ""));
    //设置新的节点类名
    el = event.target;
    el.setAttribute("class", el.getAttribute("class") + " select");
    //保存选取值
    this.sku[mulIndex] = valueIndex;
    this.attributeRef[mulIndex] = el;
    //解析一次当前的sku
    this.resolveNow();
  }

  //加载sku
  querySku() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/sku/all/" + this.commodityId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.skus = data.data;
      });
  }


  //加载可选规格属性
  queryMulAttribute() {
    this.attributeNames = undefined;
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/mul/" + this.commodityId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        const cavs: Array<SSMap> = data.data;
        let i = 0;
        let flag = false;
        cavs.forEach((cav1) => {
          if (!this.attributeNames) {
            this.attributeNames = new Array();
            this.attributeNames.push(cav1);
          } else {
            this.attributeNames.forEach((cav2) => {
              if (cav1.attributeName == cav2.attributeName) {
                this.attributeNames[i].attributeValue = cav2.attributeValue + "," + cav1.attributeValue;
                flag = true;
              }
              i++;
            });
            if (!flag) {
              this.attributeNames.push(cav1);
            } else {
              flag = false;
            }
            i = 0;
          }
        });
        //分解值
        this.getValueList();
        //初始选取颜色
        setTimeout(() => {
          this.sku = [];
          i = 0;
          this.attributeNames.forEach((a) => {
            this.sku[i] = 0;
            const el = document.getElementsByClassName(a.attributeName)[0];
            el.setAttribute("class", el.getAttribute("class") + " select");
            this.attributeRef[i++] = el;
          });
          this.resolveNow();
        }, 500);
      });
  }

  //通过颜色获取图片
  getMap(color: string): string {
    let str = "/static/store/head/default.jpg";
    for (let i = 0; i < this.skus.length; i++) {
      if (this.skus[i].skuValue.includes(color)) {
        str = this.skus[i].skuMap;
        break;
      }
    }
    return str;
  }

  //显示图片全屏
  async showAll(license) {
    const modal = await this.modalController.create({
      component: ImgShowComponent,//模态框中展示的组件
      componentProps: {
        "url": license
      }
    });
    return await modal.present();
  }

  dismiss() {
    this.navController.back();
  }
}
