import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'ng-zorro-antd-mobile';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

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
  hiddenUp = true;
  disabledUp = false;

  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private _toast: ToastService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.stetimeRefsh();
    this.querySlideFactory();
  }

  ionViewWillLeave() {
    clearInterval(this.timer);
  }

  // 查询轮播工厂信息
  querySlideFactory() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/slide/factory/info", GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.slideFactory = data.data;
        //当前是否有资格
        if (this.slideFactory.storeIds) {
          const ids: Array<any> = JSON.parse(this.slideFactory.storeIds);
          if (ids.includes(localStorage.getItem("storeId"))) {
            this.hiddenUp = false;
            //查看是否能上传图片
            this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/slide/store/up/over", GlobalFinal.STORE_HEADER)
              .subscribe((data: any) => {
                if (data.data) {
                  this.disabledUp = true;
                } else {
                  this.disabledUp = false;
                }
              })
          } else {
            this.disabledUp = false;
            this.hiddenUp = true;
          }
        } else {
          this.disabledUp = false;
          this.hiddenUp = true;
        }
      });
  }

  //定时刷新
  stetimeRefsh() {
    this.timer = setInterval(() => {
      this.querySlideFactory();
    }, 10000);
  }

  //获取轮播图
  getSlide() {
    this.loadingToast();
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/plant/slide/store/get", null, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this._toast.hide();
        GlobalALert.getAlert({ message: data.msg });
        this.querySlideFactory();
      });
  }

  //上传图片
  upload(event) {
    let file = event.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file, file.name);
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/plant/slide/store/up", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        this.disabledUp = true;
      });
  }

  //获取时的加载框
  loadingToast() {
    const toast = this._toast.loading('获取中...', 0, () => {
    });
  }
}
