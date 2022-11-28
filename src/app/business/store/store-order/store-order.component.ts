import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonRouterOutlet, ModalController, NavController, PopoverController } from '@ionic/angular';
import { ConditionComponent } from '../../../condition/condition.component';
import { GlobalALert, GlobalFinal, SSMap } from '../../../dto-model/dto-model.component';
import { OrderDetailComponent } from '../../../order-detail/order-detail.component';
import { ReorderComponent } from '../../../reorder/reorder.component';
@Component({
  selector: 'app-store-order',
  templateUrl: './store-order.component.html',
  styleUrls: ['./store-order.component.scss'],
})
export class StoreOrderComponent implements OnInit {
  //无限滚动组件
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  //condition样式
  conditionStyle: string = "";

  // type样式
  typeStyle: string = "";

  outsty = "";

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;

  //滚动条停止位置
  currentY: number;

  //是否数据到结尾
  isDataOver = false;

  typeHidden = false;
  backHidden = false;
  topHidden = true;


  flag: number = -1;

  orders: any;//展示的订单
  allOrders: any;//所有订单

  commodityNames: Array<SSMap>;

  //搜索关键字
  keyWord: string = "";

  //筛选条件
  conditions;

  //排序条件
  reorder;

  // 分页条件
  pageNum: number = 8;
  pageNo: number = 0;
  /**
   * 
   * @param hr 
   * @param modalController 
   * @param activatedRoute 
   * @param navController 
   * @param routerOutlet 
   */
  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private routerOutlet: IonRouterOutlet,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((param) => {
      this.queryOrderDetail(param.flag);
    })
  };

  //无线滚动
  loadData(event) {
    this.pageNo++;
    event.target.complete();
    if (this.pageNo * this.pageNum >= this.allOrders.length) {
      this.isDataOver = true;
    } else {
      this.trackNum();
    }
  }

  //html动态获取商品名字
  getCommodityName(id) {
    //foreach不会停止，会执行多次，即使返回也会遍历完,所以会有多个返回值，导致页面显示异常。
    let name = "";
    this.commodityNames.forEach(element => {
      if (element.attributeName == id) {
        name = element.attributeValue;
        return name;
      }
    });
    return name;
  }

  // 查询商品名称
  queryCommodityName() {
    const ids = new Array<string>();
    this.allOrders.forEach((obj) => {
      ids.push(obj.commodityId);
    });
    const formdata = new FormData();
    formdata.append("ids", JSON.stringify(ids));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/commodityName", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.commodityNames = data.data;
          //如果输入了关键字，进行关键字过滤
          if (!GlobalFinal.IS_EXIST.includes(this.keyWord)) {
            this.transformByKey();
          }
          //筛选出展示的条数
          this.trackNum();
        }
      });
  }

  //通过关键字过滤
  transformByKey() {
    const temp = new Array();
    if (this.commodityNames != null) {
      //先过滤id
      for (let i = 0; i < this.allOrders.length; i++) {
        if (this.allOrders[i].commodityId.indexOf(this.keyWord) > -1 || this.getCommodityName(this.allOrders[i].commodityId).indexOf(this.keyWord) > -1 || this.allOrders[i].skuValue.indexOf(this.keyWord) > -1 || this.allOrders[i].totalAmount.toString().indexOf(this.keyWord) > -1 || this.allOrders[i].commodityNum.toString().indexOf(this.keyWord) > -1) {
          temp.push(this.allOrders[i]);
        } else if (this.allOrders[i].logisticsNo != null && this.allOrders[i].logisticsNo.indexOf(this.keyWord) > -1) {
          temp.push(this.allOrders[i]);
        }
      }
      //更新allOrders
      this.allOrders = temp;
    }
  }

  /**
   * 截取指定数目进行追加
   * https://blog.csdn.net/weixin_39531229/article/details/110799066 数组常见操作
  */
  trackNum() {
    if (this.orders === undefined) {
      this.orders = new Array();
    }
    //先判定数组能否截取
    if (this.pageNo * this.pageNum >= this.allOrders.length) {
      return;
    }
    //截取数组
    this.orders.push(...this.allOrders.slice(this.pageNo * this.pageNum, (this.pageNo + 1) * this.pageNum));
  }


  //查询店铺订单细节信息
  queryOrderDetail(flag) {
    //执行一次查询就需要将pageNo进行重置
    this.pageNo = 0;
    //如果不是切换订单类型或者多次点击当前订单类型就不用执行样式修改
    if (flag != -1 && this.flag != flag) {
      this.flag = flag;
      this.addColorOnType();
    }
    //整理附加参数
    let param: Array<any> = new Array();
    if (!GlobalFinal.IS_EXIST.includes(this.conditions)) {
      param = param.concat(this.conditions);
    }
    if (!GlobalFinal.IS_EXIST.includes(this.reorder)) {
      param = param.concat(this.reorder);
    }
    if (!GlobalFinal.IS_EXIST.includes(this.keyWord)) {
      param = param.concat({ "keyWord": this.keyWord });
    }
    let head: any = GlobalFinal.STORE_HEADER;
    if (param.length != 0) {
      head = {
        headers: GlobalFinal.STORE_HEADER.headers,
        withCredentials: GlobalFinal.STORE_HEADER.withCredentials,
        params: {
          "param": JSON.stringify(param)
        }
      };
    }
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/store/data/" + this.flag + "/" + this.pageNo + "/" + this.pageNum, head)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          if (!GlobalFinal.IS_EXIST.includes(data.data) && data.data.length > 0) {
            this.allOrders = data.data;
            this.queryCommodityName();
          }
        }
      });
  }

  //打开指定模态框
  async openModal(name: string) {
    if (name === "condition") {
      const modal = await this.modalController.create({
        component: ConditionComponent,//模态框中展示的组件
        componentProps: { 'type': 0, 'childType': this.flag },//打开模态框的类型标识
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.conditions = data;
        //清除订单数据然后重新请求当前类型数据,不清除reorder
        this.allOrders = undefined;
        this.orders = undefined;
        this.queryOrderDetail(-1);
      }
    }
    if (name == "reorder") {
      const modal = await this.modalController.create({
        component: ReorderComponent,//模态框中展示的组件
        componentProps: { 'type': 0, 'childType': this.flag },//打开模态框的类型标识
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.reorder = data;
        //清除订单数据然后重新请求当前类型数据,不清除conditions
        this.allOrders = undefined;
        this.orders = undefined;
        this.queryOrderDetail(-1);
      }
    }
  }

  //切换订单类型时调用
  toogleType(flag) {
    //清除order、condition、reorder数据,不清除keyWord
    this.allOrders = undefined;
    this.orders = undefined;
    this.conditions = undefined;
    this.reorder = undefined;
    this.typeStyle = "";
    this.conditionStyle = "";
    this.isDataOver = false;
    //加载数据
    this.queryOrderDetail(flag);
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

  // 监听内容滚动
  scroll(event: CustomEvent) {
    this.currentY = event.detail.currentY;
    //判断滚动方向滚动方向
    if (event.detail.deltaY > 0) {
      //如果是在下滑
      this.typeHidden = true;
      //condition对象
      this.conditionStyle =
        "width: 100%;" +
        "height: 62px;" +
        "background-color: #ffffff;" +
        "font-size: 17px;" +
        "position:fixed;" +
        "z-index: 9;" +
        "padding-top:20px ;" +
        "padding-bottom:20px ;";
    }
    //如果向上滑
    if (event.detail.deltaY < 0) {
      //如果这时isDataOver为true,就修改
      this.isDataOver = this.isDataOver ? false : false;
      //显示type
      this.typeHidden = false;
      //如果滚动快到顶端就使用原始样式
      if (event.detail.currentY > 3) {
        this.typeStyle =
          "width: 100%;" +
          "height: 60px;" +
          "background-color: #ffffff;" +
          "font-size: 18px;" +
          "box-shadow: 0px 1px 1px rgb(208, 205, 205);" +
          "position:fixed;" +
          "z-index: 9;";
        this.conditionStyle =
          "width: 100%;" +
          "height: 42px;" +
          "background-color: #ffffff;" +
          "font-size: 17px;" +
          "position:fixed;" +
          "z-index: 9;" +
          "margin-top: 60px;";
      } else {
        this.typeStyle = "";
        this.conditionStyle = "";
      }
    }

  }

  //当停止时
  scrollEnd() {
    //判断滚动条位置
    if (this.currentY >= 69) {
      this.topHidden = false;
    } else {
      this.topHidden = true;
    }
  }

  //点击回到顶部
  toTop() {
    this.content.scrollToTop(200);
  }

  //返回上一个路由
  back() {
    this.navController.pop();
  }

  //搜索框得到焦点时隐藏回退
  hiddenBack() {
    this.backHidden = true;
  }

  //搜索框失去焦点或者取消，显示回退框
  showBack() {
    this.backHidden = false;
  }

  //搜索提交时，检索数据
  searchSub() {
    this.toogleType(-1);
  }

  //订单发货
  async orderTrans(event: Event, index) {
    const popover = await this.popoverController.create({
      component: MenuOrderTransComponent,
      event: event,
      animated: true,
      cssClass: 'order-trans-popover'
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (data !== undefined) {
      //设置订单细节的物流单号,formdata才能发送成功数字，而option的params不能
      const formdata = new FormData();
      formdata.append("odId", this.orders[index].odId);
      formdata.append("orderNumber", this.orders[index].orderNumber);
      formdata.append("logisticsNo", data.logisticsNo);
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/order/store/trans", formdata, GlobalFinal.STORE_HEADER)
        .subscribe((data: any) => {
          GlobalALert.getToast(data.msg);
          this.allOrders = undefined;
          this.orders = undefined;
          this.queryOrderDetail(-1);
        });
    }
  }

  //订单详情
  async orderDetailInfo(index) {
    const modal = await this.modalController.create({
      component: OrderDetailComponent,//模态框中展示的组件
      componentProps: {
        'type': 0,
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
}


@Component({
  selector: 'app-menu-ordertrans',
  template:
    `
  <div class="out" [style]="outsty">
    <div class="title">
      <span>订单发货</span>
    </div>
    <div class="input">
      <ion-item mode="ios">
        <ion-input [(ngModel)]="logisticsNo" placeholder="填写物流单号"></ion-input>
      </ion-item>
    </div>
    <div class="button">
      <ion-button (click)="cancel()" expand="block" fill="clear" shape="round">
        取消
      </ion-button>
      <ion-button (click)="trans()" expand="block" fill="clear" shape="round">
        发货
      </ion-button>
    </div>
  </div>
  `,
  styles: [
    `
    .out {
      width: 360px;
      height: 200px;
      box-shadow: 0px 1px 1px rgb(108, 106, 106);
      background: rgb(255, 255, 255);
  }
  
  .title {
      font-size: 22px;
      margin-bottom: 15px;
  }
  
  .title span {
      margin-left: 136px;
  }
  
  
  .button ion-button {
      display: inline-block;
      width: 80px;
      font-size: 18px;
      margin-top: 50px;
  }
  
  .button ion-button:first-child {
      margin-left: 20px;
      margin-right: 160px;
      --background: #e0e0e0;
      --color: #333333;
  }
  
  .button ion-button:last-child {
      --background: #58b4ff;
      --color: #ffffff;
  }

    `
  ]
})
export class MenuOrderTransComponent implements OnInit {
  logisticsNo = "";

  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.popoverController.dismiss();
  }

  trans() {
    if (this.logisticsNo == "") {
      this.cancel();
    }
    this.popoverController.dismiss({ "logisticsNo": this.logisticsNo });
  }
}
