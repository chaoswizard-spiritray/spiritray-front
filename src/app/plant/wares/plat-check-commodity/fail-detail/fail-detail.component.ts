import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Cav, CheckInfo, CommoditySimple, GlobalFinal, Sku, StoreLicenseSimple } from '../../../../dto-model/dto-model.component';
import { ImgShowComponent } from '../../../../img-show/img-show.component';

@Component({
  selector: 'app-fail-detail',
  templateUrl: './fail-detail.component.html',
  styleUrls: ['./fail-detail.component.scss'],
})
export class FailDetailComponent implements OnInit {
  commoditySimple: CommoditySimple;

  storeLicenseSimple: StoreLicenseSimple;

  skus: Array<Sku>;

  simpleCavs: Array<Cav>;

  mulCavs: Array<Cav>;

  checkInfo: CheckInfo;



  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    //解析参数
    const commodity = this.navParams.get("commoditySimple");
    this.commoditySimple = JSON.parse(commodity);
    //加载审核信息
    this.queryCheckInfo();
  }

  //切换店铺信息显示
  toggleStoreInf() {
    const storeInf = document.getElementsByClassName('storeInf')[0];
    if (!(storeInf.getAttribute("hidden") === null)) {
      //打开
      storeInf.removeAttribute("hidden");
      //加载数据
      this.queryStoreAndLicense();
    } else {
      //关闭
      storeInf.setAttribute("hidden", 'true');
    }
  }

  //切换sku显示
  toggleSku() {
    const sku = document.getElementsByClassName('sku')[0];
    if (!(sku.getAttribute("hidden") === null)) {
      //打开
      sku.removeAttribute("hidden");
      //加载数据
      this.querySku();
    } else {
      //关闭
      sku.setAttribute("hidden", 'true');
    }
  }

  //切换attribute显示
  toggleCav() {
    const cav = document.getElementsByClassName('cav')[0];
    if (!(cav.getAttribute("hidden") === null)) {
      //打开
      cav.removeAttribute("hidden");
      //加载数据
      this.querySimpleAttribute();
      this.queryMulAttribute();
    } else {
      //关闭
      cav.setAttribute("hidden", 'true');
    }
  }

  //加载审核信息
  queryCheckInfo() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/plat/check/info/" + this.commoditySimple.commodityId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.checkInfo = data.data;
      });
  }

  //加载店铺执照
  queryStoreAndLicense() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeLicenseSimple/" + this.commoditySimple.storeId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.storeLicenseSimple = data.data;
      });
  }

  //加载sku
  querySku() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/sku/all/" + this.commoditySimple.commodityId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.skus = data.data;
      });
  }

  //加载参数信息
  querySimpleAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/simple/" + this.commoditySimple.commodityId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.simpleCavs = data.data;
      });
  }

  queryMulAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/mul/" + this.commoditySimple.commodityId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        console.log(data);

        const cavs: Array<Cav> = data.data;
        let flag = false;
        this.mulCavs = [];
        cavs.forEach((cav1) => {
          this.mulCavs.forEach((cav2) => {
            if (cav1.attributeName = cav2.attributeName) {
              cav2.attributeValue += "," + cav1.attributeValue;
              flag = true;
            }
          })
          if (!flag) {
            this.mulCavs.push(cav1);
          }
        });
      });
  }

  dismiss() {
    this.navParams.data.modal.dismiss();
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
}
