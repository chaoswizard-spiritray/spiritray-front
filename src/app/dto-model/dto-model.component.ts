import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dto-model',
  templateUrl: './dto-model.component.html',
  styleUrls: ['./dto-model.component.scss'],
})
export class DtoModelComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}

//全局常量
export class GlobalFinal {
  constructor() { };

  //数据是否为空
  public static IS_EXIST = [null, '', 0, undefined, NaN];
  //请求头
  public static HEADER = {
    headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", "content-type": "application/json" }),
    withCredentials: true
  };
  //带jwt的请求头
  public static JWTHEADER = {
    headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", 'jwt': localStorage.getItem("jwt") }),
    withCredentials: true
  };
  //店铺相关操作请求头
  public static STORE_HEADER = {
    headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", 'jwt': localStorage.getItem("jwt"), 'storeId': localStorage.getItem("storeId") }),
    withCredentials: true,

  }
  //平台相关操作请求头
  public static PLAT_HEADER = {
    headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", 'jwt': localStorage.getItem("staffJwt"), 'staffId': localStorage.getItem("staffId") }),
    withCredentials: true
  }
  //用户电话
  public PHONE = (localStorage.getItem("userInf") != null) ? (JSON.parse(localStorage.getItem("userInf"))).consumerPhone : null;
  //ip
  public static DEVIP = "http://localhost";
  //consumer测试地址
  public static DOMAIN = GlobalFinal.DEVIP + ":8080";
  //seller测试地址
  public static SELLER_DOMAIN = GlobalFinal.DEVIP + ":8081";
  //order测试地址
  public static ORDER_DOMAIN = GlobalFinal.DEVIP + ":8082";
  //plant测试地址
  public static PLANT_DOMAIN = GlobalFinal.DEVIP + ":8083";
  //file服务地址
  public static FILE_DOMAIN = GlobalFinal.DEVIP + ":80";
  //给指定元素追加指定div内容
  public static appendHTML(obj: Element, htmls: string) {
    let el: Element = document.createElement("div");
    el.innerHTML = htmls;
    obj.appendChild(el);
  }
}

//全局对话框
export class GlobalALert {
  private static alertM = new AlertController();
  private static toast = new ToastController();
  constructor() { };
  //信息定时提示对话框
  static getAlert(obj) {
    GlobalALert.alertM.create(obj)
      .then((alterS) => {
        alterS.present();
        setTimeout(() => { alterS.remove() }, 1000);
      }
      );
  }

  static async getToast(msg: string, time?: number) {
    if (time == null || time <= 0) {
      time = 500;
    }
    await this.toast.create({
      message: msg,
      duration: time
    }).then(async (e) => {
      await e.present();
    })
  }
}
//全部数据加载错误控制
export class GlobalFlagShow {
  //关闭指定图标
  static closeLog(log: string) {
    let el = document.getElementsByClassName(log);
    for (let i = 0; i < el.length; i++) {
      el[i].setAttribute("hidden", "true");
    }
  }
  //打开指定图标
  static openLog(log: string) {
    let el = document.getElementsByClassName(log);
    for (let i = 0; i < el.length; i++) {
      el[i].removeAttribute("hidden");
    }
  }
  //显示指定图标,关闭其他图标
  static onlyOpenLog(log: string, ...others: Array<string>) {
    this.openLog(log);
    others.forEach((s) => {
      this.closeLog(s);
    });
  }
  // 切换内容区显示,传入信息
  static tologLog(log: string) {
    let el = document.getElementsByClassName(log)[0];
    if (el.getAttribute("hidden") || el.getAttribute("hidden") == "") {
      el.removeAttribute("hidden");
    } else {
      el.setAttribute("hidden", "true");
    }
  }
  //加载失败内容显示函数
  static loadFail() {
    //隐藏加载图标
    this.tologLog("loadFlag");
    //显示错误图标
    this.tologLog("errorFlag");
  }
  //加载成功显示
  static loadSuccess() {
    //隐藏加载图标
    this.tologLog("loadFlag");
    //显示数据内容区
    this.tologLog("contentFlag");
  }
}

//轮播图
export class SlideShow {
  constructor(
    public storeId: string,
    public mapUrl: string) { }
}

//首页商品
export class HomeCommoditySimple {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public favorableRate: number,//好评率
    public priceMin: number,///价格最小值
    public priceMax: number///价格最大值
  ) { }
}

//commodityshop
export class CommodityShop {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public storeId: string,//店铺id
    public shipping: number,//运费
    public address: string,//发货地址
    public priceMin: number
  ) { }
}

//买家
export class Consumer {
  constructor(
    public consumerHead: string,
    public consumerNickname: string,
    public consumerPhone: number,
    public consumerPassword: string,
    public consumerSex = 0,
    public isEnter = 0
  ) {
  }
}
//地址
export class Address {
  constructor(
    public addressId: string,
    public consumerPhone: number,
    public address: string,//收货地址
    public takeName: string,//收货人
    public takePhone: number,//收货人电话
    public isDefault: number//默认收货地址
  ) { }
}

//ns映射
export class NSMap {
  constructor(
    public key: number,
    public value: string
  ) { }
}

//sn映射
export class SNMap {
  constructor(
    public key: string,
    public value: number
  ) { }
}

//ss
export class SSMap {
  constructor(
    public attributeName: string,
    public attributeValue: string
  ) { }
}

//商家信息
export class Seller {
  constructor(
    public sellerId: string,
    public sellerName: string,
    public sellerPhone: Number,
    public sellerPath: string
  ) { }
}

//店铺基本信息
export class Store {
  constructor(
    public storeId: string,
    public sellerId: string,
    public storeName: string,
    public storeHead: string,
    public status: number,
    public closeDate: Date,
    public closeCause: string
  ) { }
}

//平台账户类别
export class AccountCategory {
  constructor(
    public accaId: number,
    public accaName: string,
    public isOpen: number
  ) { }
}

//商家账户信息
export class SellerAccount {
  constructor(
    public accountId: number,
    public storeId: string,
    public accountNo: string,
    public accountName: string,
    public accaId: number,
    public isCollections: number
  ) { }
}

//平台账户信息
export class PlantAccount {
  constructor(
    public paId: number,
    public accaId: number,
    public appId: string,
    public accountNo: string,
    public accountKey: string,
    public isUseable: number
  ) { }

}

//购物车商品信息
export class Cart {
  constructor(
    public cartId: number,
    public commodityId: string,
    public consumerPhone: number,
    public commodityName: string,
    public commodityNum: number,
    public skuValue: string,
    public skuMap: string,
    public totalFee: number
  ) { }
}



//添加时基本商品信息
export class Commodity {
  constructor(
    public commodityId: string,
    public storeId: string,
    public categoryId: number,
    public commodityName: string,
    public shipping: number,
    public masterMap: string,
    public commodityDescribe: string,
    public address: string
  ) { };
}

//商品类别信息
export class Category {
  constructor(
    public categoryId: number,
    public categoryName: string,
    public father: number
  ) { }
}

//商品类别对应的属性
export class Attribute {
  constructor(
    public attributeId: number,
    public attributeName: string,
    public isMul: number,
  ) { }
}

//商品属性值
export class Cav {
  constructor(
    public commodityId: string,
    public attributeId: number,
    public attributeName: string,
    public attributeValue: string
  ) { }
}

//审查信息
export class CheckInfo {
  constructor(
    public commodityId: string,
    public applyDate: Date,
    public checkDate: Date,
    public staffId: number,
    public checkCode: number,
    public remark: string,
    public info: string,
    public state: number
  ) { }
}

//进入订单前商品信息
export class OrderBeforeCommodity {
  constructor(
    public orderId: string,
    public commodityId: string,
    public commodityName: string,
    public sku: Sku,
    public commodityNum: number,
    public shipping: number
  ) { }
}

//订单信息
export class Order {
  constructor(
    public orderNumber: string,
    public consumerPhone: number,
    public orderDate: Date,
    public totalAmount: number
  ) { }
}

//订单细节
export class OrderDetail {
  constructor(
    public orderNumber: string,
    public odId: number,
    public storeId: string,
    public commodityId: string,
    public skuValue: string,
    public skuMap: string,
    public commodityNum: number,
    public totalAmount: number,
    public addressMsg: string,
    public state: number,
    public logisticsNo: string,
    public overDate: Date
  ) { }
}

//sku
export class Sku {
  constructor(
    public commodityId: string,
    public skuValue: string,
    public skuMap: string,
    public skuPrice: number,
    public num: number
  ) { }
}

//上架商品简略信息DTO
export class InSellSimple {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public inSellDay: number//上架天数
  ) { }
}

//上架商品详情信息DTO
export class InSellDetail {
  constructor(
    public commodityId: string,
    public commodityName: string,
    public categoryName: string,
    public masterMap: string,
    public address: string,
  ) { }
}

//商品简略信息
export class CommoditySimple {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public storeId: string,//店铺ID
  ) { }
}

//带执照信息的店铺简略信息
export class StoreLicenseSimple {
  constructor(
    public storeName: string,
    public storeHead: string,
    public license: Array<string>
  ) { }
}

//审核中商品简略信息
export class InCheckSimple {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public checkInfo: string,//审核信息
    public checkState: number//审核状态码
  ) { }
}

//商品审核详细信息
export class InCheckDetail {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public checkInfo: string,//审核信息
    public checkState: number,//审核状态码
    private applyDate: Date,//发起时间
    private checkDate: Date,//审核时间
    private staffId: string,//审核工号
    private remark: string//审核备注
  ) { }
}

//下架商品简略信息
export class NoSellSimple {
  constructor(
    public commodityId: string,//商品id
    public masterMap: string,//商品主图
    public commodityName: string,//商品名称
    public downDate: Date,//下架的日期
    public downCommotion: string//下架备注
  ) { }
}

// 商品查询条件对象
export class Conditional {
  constructor(
    public keyWord: string,//查询的关键字
    public pageCapacity: Number,//分页查询每页的容量
    public pageNum: Number,//分页的第几页
    public priceSorted = -1,//按照价格排序是正序还是逆序，-1标识不生效，0正序，1逆序
  ) {
  }
}

//注册DTO
export class RegisterDTO {
  constructor(
    public consumer: Consumer,
    public code: String
  ) {
  }
}

//登录DTO
export class LoginDTO {
  constructor(
    public consumer: Consumer,
    public jwt: String) { };
}


