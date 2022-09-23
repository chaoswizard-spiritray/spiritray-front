import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CommodityShop, GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
import { LocationService } from '../../service/location.service';
import { CommodityParamComponent } from './commodity-param/commodity-param.component';

@Component({
  selector: 'app-commodity-shop',
  templateUrl: './commodity-shop.component.html',
  styleUrls: ['./commodity-shop.component.scss']
})
export class CommodityShopComponent implements OnInit, OnDestroy {

  commodityId: string;

  commodityShop: CommodityShop;

  startTime: Date;


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
