import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFinal, GlobalFlagShow, NoSellSimple } from '../../../dto-model/dto-model.component';
import { ToastService } from 'ng-zorro-antd-mobile';
import { StoreRouterDataService } from '../../../service/store-router-data.service';

@Component({
  selector: 'app-nosell',
  templateUrl: './nosell.component.html',
  styleUrls: ['./nosell.component.scss'],
})
export class NoSellComponent implements OnInit {
  private commoditys: Array<NoSellSimple>;

  condition = "";

  constructor(
    private router: Router,
    private hr: HttpClient,
    private srd: StoreRouterDataService,
    private _toast: ToastService
  ) { }

  ngOnInit() {
    //初始加载数据
    this.loadDataTime(1000);
  }

  //根据搜索框内容查询商品
  startQuery() {
    this.condition = this.srd.searchContext;
    //过滤数据,注意要延时滞空searchContext，因为我们依靠于angular的变更检测，所以如果立即修改，angular就会报错
    const trimer = setTimeout(() => {
      this.pipeCommodity();
      setTimeout(() => {
        //提示框也需要延时关闭，不然就会一直打开。
        this._toast.hide();
        clearTimeout(trimer);
      }, 500);
    }, 200);
    return "complate？";
  }

  //根据输入内容过滤商品数据
  pipeCommodity() {
    //清除数据
    this.srd.searchContext = "";
    //如果传入的是这个加密字符串，就直接重新请求一遍数据
    if (this.condition == "cb160e334b727bc2b91c2073a795b95e") {
      this.loadDataTime(1000);
      return;
    }
    //如果本身没有数据
    if (this.commoditys === undefined) {
      return;
    }
    //显示加载框
    this.loadingToast();
    const temp = new Array;
    for (let index = 0; index < this.commoditys.length; index++) {
      if (this.commoditys[index].commodityId == this.condition || this.commoditys[index].commodityName.includes(this.condition)) {
        temp.push(this.commoditys[index]);
      }
    }
    if (temp.length > 0) {
      this.commoditys = temp;
      return;
    }
    if (temp.length == 0) {
      this.commoditys = undefined;
    }
  }

  //显示加载框
  loadingToast() {
    const toast = this._toast.loading('Loading...', 0, () => {
      console.log('Load complete !!!');
    }, true);
  }


  //定时加载数据
  loadDataTime(time) {
    // 请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/nosell/simple", GlobalFinal.STORE_HEADER)
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
        console.log(this.commoditys.length);

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
}
