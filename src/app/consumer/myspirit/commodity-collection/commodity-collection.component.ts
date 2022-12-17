import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-commodity-collection',
  templateUrl: './commodity-collection.component.html',
  styleUrls: ['./commodity-collection.component.scss'],
})
export class CommodityCollectionComponent implements OnInit {

  isHiddenCheckBox = true;
  collections = new Array();
  commoditys = new Array();
  checkIndexs = new Array();

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.queryCollecions();
  }
  //删除shouc
  async deleteCollection() {
    if (!this.checkIndexs.includes(true)) {
      GlobalALert.getToast("没有选取");
      return;
    }
    if (await GlobalALert.getSureAlert("确定移除收藏吗?") != "confirm") {
      return;
    } else {
      const indexs = new Array();
      let i = 0;
      this.checkIndexs.forEach(el => {
        if (el) {
          indexs.push(this.commoditys[i].commodityId,);
        }
        i++;
      });
      const head = {
        headers: GlobalFinal.JWTHEADER.headers,
        withCredentials: GlobalFinal.JWTHEADER.withCredentials,
        params: {
          "commodityIds": JSON.stringify(indexs)
        }
      }
      this.hr.put(GlobalFinal.DOMAIN + "/collection/many/delete", {}, head)
        .subscribe((data: any) => {
          this.collections = [];
          this.commoditys = [];
          this.checkIndexs = [];
          this.queryCollecions();
          GlobalALert.getAlert({ message: data.msg });
        }
        );
    }
  }

  //请求收藏信息
  queryCollecions() {
    this.hr.get(GlobalFinal.DOMAIN + "/collection/consumer/all", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.data != null && data.data.length > 0) {
        this.collections = data.data;
        //循环获取商品信息
        this.collections.forEach(el => {
          this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/order/" + el.commodityId, GlobalFinal.JWTHEADER)
            .subscribe((data1: any) => {
              if (data1.data != null) {
                this.commoditys.push(data1.data);
                this.checkIndexs.push(false);
              }
            });
        });
      }
    });
  }

  //打开选择
  openCheckBox() {
    if (this.isHiddenCheckBox) {
      this.isHiddenCheckBox = false;
    } else {
      this.isHiddenCheckBox = true;
    }
  }

  //关闭模态框
  back() {
    this.modalController.dismiss();
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
}
