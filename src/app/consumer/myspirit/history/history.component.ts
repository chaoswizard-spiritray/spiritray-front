import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  isHiddenCheckBox = true;
  checkTimes = new Array();
  checkCommoditys = new Array();
  times = new Array();
  historys = new Array();
  commoditys = new Array();

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.queryHistory();
  }
  //批量删除历史记
  async deleteCollection() {
    //封装数据
    const hisIds = new Array();
    for (let i = 0; i < this.checkCommoditys.length; i++) {
      if (this.checkCommoditys[i]) {
        hisIds.push(this.historys[i].hisId);
      }
    }
    if (hisIds.length == 0) {
      GlobalALert.getToast("没有选取");
      return;
    } if (await GlobalALert.getSureAlert("确定移除收藏吗?") != "confirm") {
      return;
    } else {
      const head = {
        headers: GlobalFinal.JWTHEADER.headers,
        withCredentials: GlobalFinal.JWTHEADER.withCredentials,
        params: {
          "ids": JSON.stringify(hisIds)
        }
      }
      this.hr.put(GlobalFinal.DOMAIN + "/history/clear/many", {}, head).subscribe(async (data: any) => {
        this.checkTimes = new Array();
        this.checkCommoditys = new Array();
        this.times = new Array();
        this.historys = new Array();
        this.commoditys = new Array();
        await GlobalALert.getAlert({ message: data.msg });
        this.queryHistory();
      });
    }
  }



  //进入商品购买页面
  toCommodityShop(commodityId) {
    this.modalController.dismiss();
    this.router.navigate(['/consumer/shop'], {
      queryParams: {
        'commodityId': commodityId
      }
    });
  }

  //切换时间选择时
  toggleTimeCheck(index) {
    //判断状态
    if (!this.checkTimes[index]) {
      for (let i = 0; i < this.historys.length; i++) {
        if (this.historys[i].startDate == this.times[index]) {
          this.checkCommoditys[i] = true;
        }
      }
    } else {
      for (let i = 0; i < this.historys.length; i++) {
        if (this.historys[i].startDate == this.times[index]) {
          this.checkCommoditys[i] = false;
        }
      }
    }
  }

  //切换单个图片
  toggleCommodity(index) {
    // 判断所属日期是否所有被选中
    if (!this.checkCommoditys[index]) {
      let isAll = true;
      for (let i = 0; i < this.historys.length; i++) {
        if (this.historys[i].startDate == this.historys[index].startDate) {
          if (!this.checkCommoditys[i]) {
            if (i != index) {
              isAll = false;
              break;
            }
          }
        }
      }
      if (isAll) {
        for (let j = 0; j < this.times.length; j++) {
          if (this.times[j] == this.historys[index].startDate) {
            this.checkTimes[j] = true;
          }
        }
      }
    } else {
      for (let j = 0; j < this.times.length; j++) {
        if (this.times[j] == this.historys[index].startDate) {
          this.checkTimes[j] = false;
        }
      }
    }
  }

  //关闭模态框
  back() {
    this.modalController.dismiss();
  }
  //打开选择
  openCheckBox() {
    if (this.isHiddenCheckBox) {
      this.isHiddenCheckBox = false;
    } else {
      this.isHiddenCheckBox = true;
    }
  }

  //查询历史记录
  queryHistory() {
    this.hr.get(GlobalFinal.DOMAIN + "/history/consumer/all", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.data != null && data.data.length > 0) {
        this.historys = data.data;
        //分隔时间
        let time = this.historys[0].startDate;
        this.times.push(time);
        this.historys.forEach(el => {
          if (el.startDate != time) {
            time = el.startDate;
            this.times.push(time);
            this.checkTimes.push(false);
          }
          //获取商品信息
          this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/order/" + el.commodityId, GlobalFinal.JWTHEADER)
            .subscribe((data1: any) => {
              if (data1.data != null) {
                this.commoditys.push(data1.data);
                this.checkCommoditys.push(false);
              }
            });
        });
      }
    });
  }

}
