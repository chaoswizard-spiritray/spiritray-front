import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFinal, GlobalFlagShow, NoSellSimple } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-nosell',
  templateUrl: './nosell.component.html',
  styleUrls: ['./nosell.component.scss'],
})
export class NoSellComponent implements OnInit {
  private commoditys: Array<NoSellSimple> = null;

  constructor(
    private router: Router,
    private hr: HttpClient
  ) { }

  ngOnInit() {
    //初始加载数据
    this.loadDataTime(1000);
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
