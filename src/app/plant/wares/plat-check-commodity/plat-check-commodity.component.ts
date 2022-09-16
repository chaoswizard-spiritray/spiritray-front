import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommoditySimple, GlobalFinal } from '../../../dto-model/dto-model.component';
import { CheckDetailComponent } from './check-detail/check-detail.component';
import { FailDetailComponent } from './fail-detail/fail-detail.component';
import { PassDetailComponent } from './pass-detail/pass-detail.component';

@Component({
  selector: 'app-plat-check-commodity',
  templateUrl: './plat-check-commodity.component.html',
  styleUrls: ['./plat-check-commodity.component.scss'],
})
export class PlatCheckCommodityComponent implements OnInit {
  checkL: number;
  commoditys: Array<CommoditySimple>;

  constructor(
    private activeR: ActivatedRoute,
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    //解析参数
    this.activeR.params
      .subscribe((params: Params) => {
        this.checkL = params.index;
      });
    //加载未审核的数据
    this.queryNoCheck();
  }

  //查询未审核商品数据
  queryNoCheck() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/plat/check/simple/" + this.checkL, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.commoditys = data.data;
      });
  }

  //加载未审核
  load0(num: number) {
    this.checkL = num;
    this.queryNoCheck();
  }

  load1(num: number) {
    this.checkL = num;
    this.queryNoCheck();
  }

  load2(num: number) {
    this.checkL = num;
    this.queryNoCheck();
  }

  //查看审核信息详情
  checkInfoDetail(index: number) {
    if (this.checkL == 0) {
      this.open0(index);
    } else if (this.checkL == 1) {
      this.open1(index);
    } else {
      this.open2(index);
    }
  }

  //打开未审核详细信息模态框
  async open0(index: number) {
    const modal = await this.modalController.create({
      component: CheckDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commoditySimple': JSON.stringify(this.commoditys[index])
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }
  //打开通过审核详细信息模态框
  async open1(index: number) {
    const modal = await this.modalController.create({
      component: PassDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commoditySimple': JSON.stringify(this.commoditys[index])
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  //打开拒绝详细信息模态框
  async open2(index: number) {
    const modal = await this.modalController.create({
      component: FailDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commoditySimple': JSON.stringify(this.commoditys[index])
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

}
