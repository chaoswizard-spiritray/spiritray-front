import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImgShowComponent } from '../../../img-show/img-show.component';
import { GlobalFinal, GlobalFlagShow, InSellSimple, SNMap } from '../../../dto-model/dto-model.component';
import { ModalController } from '@ionic/angular';
import { InSellDetailComponent } from './in-sell-detail/in-sell-detail.component';

@Component({
  selector: 'app-in-sell',
  templateUrl: './in-sell.component.html',
  styleUrls: ['./in-sell.component.scss'],
})
export class InSellComponent implements OnInit {

  private commoditys: Array<InSellSimple> = null;

  private sellTotals: Array<SNMap> = null;


  constructor(
    private router: Router,
    private modalController: ModalController,
    private hr: HttpClient) { }

  ngOnInit() {
    //初始加载数据
    this.loadDataTime(10);
  }

  //获取指定数目
  getMonthNum(commodityId) {
    if (this.sellTotals == null || this.sellTotals.length == 0) {
      return 0;
    } else {
      this.sellTotals.forEach((s) => {
        if (s.key == commodityId) {
          return s.value;
        }
      });
      return 0;
    }
  }

  //定时加载数据
  loadDataTime(time) {
    // 请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/insell/simple", GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          if (data.data == null) {
            //没有数据
            this.commoditys = new Array();
            GlobalFlagShow.onlyOpenLog("nodataFlag", "loadFlag", "contentFlag", "errorFlag");
          } else {
            this.commoditys = data.data.commoditys;
            this.sellTotals = data.data.sellTotals;
            GlobalFlagShow.onlyOpenLog("contentFlag", "loadFlag", "nodataFlag", "errorFlag");
          }
        }
      });
    //开启定时器,超时显示错误信息
    setTimeout(() => {
      if (this.commoditys == null) {
        //没有加载到数据就只显示错误图标
        GlobalFlagShow.onlyOpenLog("errorFlag", "loadFlag", "contentFlag", "nodataFlag");
      } else if (this.commoditys.length == 0) {
        //请求成功但是没有数据就只显示无数据图标
        GlobalFlagShow.onlyOpenLog("nodataFlag", "loadFlag", "contentFlag", "errorFlag");
      }
    }, time);
  }

  //刷新数据
  refreshing(event) {
    let time = 1000;
    //只显示加载图标
    GlobalFlagShow.onlyOpenLog("loadFlag", "errorFlag", "contentFlag", "nodataFlag");
    this.loadDataTime(time);
    setTimeout(() => { event.target.complete(); }, 1000);
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

  //展示审核详细
  async toDetail(commodityId) {
    const modal = await this.modalController.create({
      component: InSellDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commodityId': commodityId
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

}
