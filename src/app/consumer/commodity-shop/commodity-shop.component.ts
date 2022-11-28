import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommodityComment, CommodityShop, GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
import { MsgDetailComponent } from '../../msg-detail/msg-detail.component';
import { LocationService } from '../../service/location.service';
import { CommodityCommentComponent } from './commodity-comment/commodity-comment.component';
import { CommodityParamComponent } from './commodity-param/commodity-param.component';

@Component({
  selector: 'app-commodity-shop',
  templateUrl: './commodity-shop.component.html',
  styleUrls: ['./commodity-shop.component.scss']
})
export class CommodityShopComponent implements OnInit, OnDestroy {

  firstComment: CommodityComment;

  commodityId: string;

  commodityShop: CommodityShop;

  startTime: Date;

  commentNum = 0;

  isCollection = false;


  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private locationService: LocationService,
    private router: Router
  ) { }

  ngOnInit() {
    //解析参数
    this.activatedRoute.queryParams.subscribe((params) => {
      this.commodityId = params.commodityId;
      //请求数据
      this.queryCommodityShop();
      this.queryCollection();
      this.startTime = new Date();//初始浏览时间
      //增加点击数量
      this.addChick();
    });
  }

  //查询该商品的所有评论数目
  queryCOmmodityCommentCounts() {
    const headers: any = GlobalFinal.JWTHEADER;
    headers.params = {
      "commodityId": this.commodityId,
      "type": 0
    };
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts", headers).subscribe((data: any) => {
      //获取数据
      if (data.stausCode == 200) {
        this.commentNum = data.data;
      }
    });
  }

  // 查询首条评论
  queryFirstComment() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/" + this.commodityId + "/0/0/1", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          this.firstComment = data.data;
        }
      });
  }

  //通过商品id获取可下单页面的商品信息
  queryCommodityShop() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/info/detail/" + this.commodityId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.commodityShop = data.data;
        //解析数据
        const ob: Observable<any> = this.locationService.parse(this.commodityShop.address);
        let nowShow: string = "";
        if (ob != null) {
          ob.subscribe(([data1, data2, data3]: Array<any>) => {
            //拼接字符串
            if (data1.data.value === data2.data.value) {
              nowShow = data1.data.value + " " + data3.data.value;
            } else {
              nowShow = data1.data.value + " " + data2.data.value + " " + data3.data.value;
            }
            this.commodityShop.address = " " + nowShow;
          });
        }
      });
  }

  //查询是否收藏了该商品
  queryCollection() {
    this.hr.get(GlobalFinal.DOMAIN + "/collection/simple/" + this.commodityId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.isCollection = data.data;
      });
  }

  //修改收藏状态
  modifyCollection() {
    let i = 1;
    if (this.isCollection) {
      i = 0;
    }
    const fromdata = new FormData();
    fromdata.append("commodityId", this.commodityId);
    fromdata.append("state", i + "");
    this.hr.put(GlobalFinal.DOMAIN + "/collection/simple", fromdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        this.isCollection = data.data;
      });
  }

  //跳转choose地址
  skipChoose(index: number) {
    this.router.navigate(["/consumer/shop/" + "/choose"], {
      queryParams: {
        'commodityId': this.commodityId,
        'comIndex': index,
        'shipping': this.commodityShop.shipping,
        'commodityName': this.commodityShop.commodityName
      }
    });
  }

  //打开参数查看模态框
  async toParam() {
    const modal = await this.modalController.create({
      component: CommodityParamComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commodityId': this.commodityId
      },
      initialBreakpoint: 0.8,
      breakpoints: [0.8, 0.8, 0.8],
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  // 打开评论查看模态框
  async showComment() {
    // 先判断数目
    if (this.commentNum > 0) {
      const modal = await this.modalController.create({
        component: CommodityCommentComponent,//模态框中展示的组件
        handle: false,
        componentProps: {
          'commodityId': this.commodityId
        },
        swipeToClose: true,
        presentingElement: await this.modalController.getTop()
      });
      await modal.present();
    }
  }

  //打开消息模态框
  openMsgDetail() {
    let senderId;
    //先获取店铺电话
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/phone/" + this.commodityShop.storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        senderId = data.data;
        this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + this.commodityShop.storeId, GlobalFinal.JWTHEADER)
          .subscribe(async (data: any) => {
            //打开消息细节模态框
            const modal = await this.modalController.create({
              component: MsgDetailComponent,//模态框中展示的组件
              handle: false,
              componentProps: {
                'receiverName': data.data.storeName,
                'receiverHead': data.data.storeHead,
                'receiverRole': 2,
                'receiverId': senderId,
                'senderRole': 1
              },
              swipeToClose: true,
              presentingElement: await this.modalController.getTop()
            });
            await modal.present();
          });
      });
  }

  dismiss() {
    //添加浏览历史
    this.modifyHistory();
    this.navController.back();
  }

  toCart() {
    this.router.navigateByUrl("/consumer/cart");
  }

  //组件销毁时更新收藏信息以及点击数量
  ngOnDestroy(): void {
    //添加浏览历史
    this.modifyHistory();
  }

  //更新浏览历史
  modifyHistory() {
    if (localStorage.getItem("jwt")) {
      //封装信息
      const lookTime = new Date().valueOf() - this.startTime.valueOf();
      const formdata = new FormData();
      formdata.append("commodityId", this.commodityId);
      formdata.append("lookTime", lookTime + "");
      this.hr.post(GlobalFinal.DOMAIN + "/history/add", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => { });
    }
  }

  //增加商品点击量
  addChick() {
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/click/num", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => { });
  }

}
