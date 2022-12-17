import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ToastService } from 'ng-zorro-antd-mobile';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-modify-sku-price',
  templateUrl: './modify-sku-price.component.html',
  styleUrls: ['./modify-sku-price.component.scss'],
})
export class ModifySkuPriceComponent implements OnInit {
  @Input() skus;
  @Input() commodityId;
  skuList = new Array();
  newPrices = new Array();
  isShowModify = new Array();
  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private _toast: ToastService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.skuList = JSON.parse(this.skus);
    this.skuList.forEach(el => {
      this.newPrices.push(el.skuPrice);
      this.isShowModify.push(true);
    });
  }

  //修改
  modify(index) {
    this.isShowModify[index] = false;
  }

  cancel(index) {
    this.isShowModify[index] = true;
  }

  //提交单个sku价格
  submitSimple(index) {
    //判断价格是否有变化
    if (this.newPrices[index] == this.skuList[index].skuPrice) {
      GlobalALert.getToast("价格没有变化");
      return;
    }
    if (this.newPrices[index] < 0) {
      GlobalALert.getToast("价格为负");
      return;
    }
    //加载框
    this.loadingToast();
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    formdata.append("skuValue", this.skuList[index].skuValue);
    formdata.append("price", this.newPrices[index]);
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/sku/simple/price", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      this._toast.hide();
      GlobalALert.getToast(data.msg);
      this.skuList[index].skuPrice = this.newPrices[index];
      this.isShowModify[index] = true;
    });
  }

  //显示加载框
  loadingToast() {
    const toast = this._toast.loading('Loading...', 0, () => {
    }, true);
  }
}
