import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GlobalFinal, GlobalFlagShow, InCheckSimple } from '../../../dto-model/dto-model.component';
import { ImgShowComponent } from '../../../img-show/img-show.component';
import { CheckDetailComponent } from './check-detail/check-detail.component';

@Component({
  selector: 'app-in-check',
  templateUrl: './in-check.component.html',
  styleUrls: ['./in-check.component.scss'],
})
export class InCheckComponent implements OnInit {

  private commoditys: Array<InCheckSimple> = null;


  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    //初始加载数据
    this.loadDataTime(1000);
  }

  //定时加载数据
  loadDataTime(time) {
    // 请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/incheck/simple", GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          if (data.data == null) {
            //没有数据
            this.commoditys = new Array();
            GlobalFlagShow.onlyOpenLog("nodataFlag", "loadFlag", "contentFlag", "errorFlag");
          } else {
            this.commoditys = data.data;
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

  isEixst(obj) {
    return !GlobalFinal.IS_EXIST.includes(obj);
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
      component: CheckDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'commodityId': commodityId
      },
      initialBreakpoint: 0.9,
      breakpoints: [0.4, 0.6, 0.9],
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }
}

