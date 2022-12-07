import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, SSMap } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-slide-img',
  templateUrl: './slide-img.component.html',
  styleUrls: ['./slide-img.component.scss'],
})
export class SlideImgComponent implements OnInit {

  slideFactory;
  workNumber = 0;
  idleNum = 0;
  idleTimeUnit = 0;
  productSlideNum = 0;
  timer;
  publishNos: Array<String> = new Array();
  storeInfos: Array<Array<SSMap>> = new Array();
  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.querySlideFactory();
    this.queryStoreInfo();
    this.stetimeRefsh();
  }

  ionViewWillLeave() {
    clearInterval(this.timer);
  }

  // 查询轮播工厂信息
  querySlideFactory() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/slide/factory/info", GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.slideFactory = data.data;
      });
  }


  //获取本轮中奖者的用户信息
  queryStoreInfo() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/slide/get/all", GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          const map = new Map(Object.entries(data.data));
          const allInfos = new Array();
          const nos = new Array();
          map.forEach((v: any, k: string) => {
            const info = new Array<SSMap>();
            nos.push(k);
            v.forEach(s => {
              this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + s, GlobalFinal.PLAT_HEADER).subscribe((data: any) => {
                const smp = new SSMap(data.data.storeHead, data.data.storeName);
                info.push(smp);
              });
            });
            allInfos.push(info);
          });
          this.publishNos = nos;
          this.storeInfos = allInfos;
        }
      });
  }

  //定时刷新
  stetimeRefsh() {
    this.timer = setInterval(() => {
      this.querySlideFactory();
      this.queryStoreInfo();
    }, 10000);
  }

  //开启轮播图
  async startFactory() {
    if (this.workNumber == null || this.workNumber == 0 || this.productSlideNum == null || this.productSlideNum == 0 || this.idleNum == null || this.idleNum == 0) {
      GlobalALert.getAlert({ message: "参数不合理" });
    } else {
      if (await GlobalALert.getSureAlert("确认启动轮播图吗？") == 'confirm') {
        const formdata = new FormData();
        formdata.append("workNumber", this.workNumber + "");
        formdata.append("idleNum", this.idleNum + "");
        formdata.append("idleTimeUnit", this.idleTimeUnit + "");
        formdata.append("productSlideNum", this.productSlideNum + "");
        this.hr.post(GlobalFinal.PLANT_DOMAIN + "/plant/slide/factory/config", formdata, GlobalFinal.PLAT_HEADER)
          .subscribe((data: any) => {
            GlobalALert.getAlert({ message: data.msg });
            if (data.stausCode == 200) {
              this.querySlideFactory();
            }
          });
      }
    }
  }

}
