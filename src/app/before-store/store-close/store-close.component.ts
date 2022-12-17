import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-close',
  templateUrl: './store-close.component.html',
  styleUrls: ['./store-close.component.scss'],
})
export class StoreCloseComponent implements OnInit {
  role = 0;//进入界面的身份0平台、1买家、2商家,传递过来
  header;
  storeInfo;//店铺信息,传递过来
  sellerCloseInfo;//商家主动关闭信息
  plantCloseInfo;//平台查封信息

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.parseParam();
  }


  //解析参数
  parseParam() {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.role = data.role;
      this.storeInfo = JSON.parse(data.storeInfo);
      this.setHeader();
      this.queryStoreCloseInfo();
    });
  }

  //设置请求头
  setHeader() {
    switch (this.role) {
      case 0: {
        this.header = GlobalFinal.PLAT_HEADER;
      }; break;
      case 1: {
        this.header = GlobalFinal.JWTHEADER;
      }; break;
      case 2: {
        this.header = GlobalFinal.STORE_HEADER;
      }; break;
    }
  }

  //请求店铺关闭信息
  queryStoreCloseInfo() {
    switch (this.storeInfo.status) {
      // 如果是商家主动关闭
      case 0: {
        this.queryStoreSellerClose();
      }; break;
      case 2: {
        this.queryStorePlantClose();
      }
    }
  }

  //查询商家主动关闭信息
  queryStoreSellerClose() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/close/info/seller/" + this.storeInfo.storeId, this.header)
      .subscribe((data: any) => {
        this.sellerCloseInfo = data.data;
      });
  }

  //查询店铺查封信息
  queryStorePlantClose() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/close/info/plant/" + this.storeInfo.storeId, this.header)
      .subscribe((data: any) => {
        this.plantCloseInfo = data.data;
      });
  }

  //退出关闭页面
  dismiss() {
    switch (this.role) {
      case 0: {
        this.router.navigate(['/plant/shop']);
      }; break;
      case 1: {
        this.router.navigate(['/consumer']);
      }; break;
      case 2: {
        this.router.navigate(['/consumer']);
      }; break;
    }
  }

}
