import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { ConditionComponent } from '../../../condition/condition.component';
import { GlobalFinal } from '../../../dto-model/dto-model.component';
import { ReorderComponent } from '../../../reorder/reorder.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;

  //滚动条停止位置
  currentY: number;
  typeHidden = false;
  conditionStyle: string = "";
  typeStyle: string = "";
  checks = ["check", "nocheck"];//选择查询的类型

  //商品信息
  commoditys = new Array();
  stores = new Array();
  checkCommodity = true;
  word: string = "";
  //筛选条件
  conditions;
  //排序条件
  reorder;

  pageNo = 0;
  pageNum = 20;


  // 封装一个条件传递到商品展示组件上，通过展示组件去请求数据

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private navController: NavController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe((data: any) => {
      if (data.word) {
        this.word = data.word;
      }
      //调用查询
      const tempCheck = localStorage.getItem("searchCheck");
      if (tempCheck == null || tempCheck == 'commodity') {
        localStorage.setItem("searchCheck", "commodity");
        this.commoditys = [];
        this.querySearchCommodity();
      } else {
        this.stores = [];
        this.querySearchStore();
      }
    });
  }

  ionViewWillLeave() {
    localStorage.setItem("searchCheck", "commodity");
  }

  //切换
  toogleCheck(check) {
    if (check) {
      localStorage.setItem("searchCheck", "commodity");
      this.stores = [];
      this.checks[0] = "check";
      this.checks[1] = "nocheck";
      this.querySearchCommodity();
    } else {
      localStorage.setItem("searchCheck", "store");
      this.commoditys = [];
      this.conditions = [];
      this.conditionStyle = "";
      this.typeHidden = false;
      this.typeStyle = "";
      this.reorder = null;
      this.pageNo = 0;
      this.checks[0] = "nocheck";
      this.checks[1] = "check";
      this.querySearchStore();
    }
  }

  //查询商品信息
  querySearchCommodity() {
    this.word.toLowerCase();
    //封装附加参数
    //整理附加参数
    let param: Array<any> = new Array();
    if (!GlobalFinal.IS_EXIST.includes(this.conditions)) {
      param = param.concat(this.conditions);
    }
    if (!GlobalFinal.IS_EXIST.includes(this.reorder)) {
      param = param.concat(this.reorder);
    }
    let head: any = GlobalFinal.HEADER;
    if (param.length != 0) {
      head = {
        headers: GlobalFinal.HEADER.headers,
        withCredentials: GlobalFinal.HEADER.withCredentials,
        params: {
          "param": JSON.stringify(param)
        }
      };
    }
    // for (let i = 0; i < 200; i++) {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/search/" + this.word + "/" + this.pageNo + "/" + this.pageNum, head)
      .subscribe((data: any) => {
        if (data.data != null && data.data.length > 0) {
          this.commoditys.push(...data.data);
        }
      });
    // }
  }

  //查询店铺信息
  querySearchStore() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/search/store/" + this.word, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null && data.data.length > 0) {
          this.stores = data.data;
        }
      });
  }

  //打开指定模态框
  async openModal(name: string) {
    if (name === "condition") {
      const modal = await this.modalController.create({
        component: ConditionComponent,//模态框中展示的组件
        componentProps: { 'type': 1, 'childType': 0, 'word': this.word },//打开模态框的类型标识
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.conditions = data;
        //清除订单数据然后重新请求当前类型数据,不清除reorder
        this.commoditys = [];
        this.querySearchCommodity();
      }
    }
    if (name == "reorder") {
      const modal = await this.modalController.create({
        component: ReorderComponent,//模态框中展示的组件
        componentProps: { 'type': 1, 'childType': 0 },//打开模态框的类型标识
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        this.reorder = data;
        //清除订单数据然后重新请求当前类型数据,不清除conditions
        this.commoditys = [];
        this.querySearchCommodity();
      }
    }
  }

  //进入商品购买页面
  toCommodity(commodityId) {
    this.router.navigate(['/consumer/shop'], {
      queryParams: {
        'commodityId': commodityId
      }
    });
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
        "background: rgb(255, 194, 194);" +
        "color: rgb(0, 0, 0);" +
        "position:fixed;" +
        "z-index: 9;"
    }
    //如果向上滑
    if (event.detail.deltaY < 0) {
      //显示type
      this.typeHidden = false;
      //如果滚动快到顶端就使用原始样式
      if (event.detail.currentY > 3) {
        this.typeStyle =
          "background: rgb(255, 194, 194, .95);" +
          "color: rgb(0, 0, 0);" +
          "position:fixed;" +
          "z-index: 9;";
        this.conditionStyle =
          "background: rgb(255, 194, 194);" +
          "position:fixed;" +
          "z-index: 9;" +
          "margin-top: 48px;";
      } else {
        this.typeStyle = "";
        this.conditionStyle = "";
      }
    }
  }

  //跳转店铺
  toBeforeStore(storeId) {
    //获取店铺电话
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/phone/" + storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.router.navigate(["/before-store"], {
          queryParams: {
            'storeId': storeId,
            'type': 0,
            'storePhone': data.data
          }
        });
      });

  }

  //点击回到顶部
  toTop() {
    this.content.scrollToTop(500);
    this.typeStyle = "";
    this.conditionStyle = "";
  }
}
