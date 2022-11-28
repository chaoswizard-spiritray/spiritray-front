import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalFinal, InCheckDetail, Sku, SSMap } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-in-sell-detail',
  templateUrl: './in-sell-detail.component.html',
  styleUrls: ['./in-sell-detail.component.scss'],
})
export class InSellDetailComponent implements OnInit {

  @Input() commodityId: string;

  inCheckDetail: InCheckDetail;

  skus: Array<Sku>;

  simpleCavs: Array<SSMap>;

  mulCavs: Array<SSMap>;

  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.queryCheckInf();
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

  //加载sku
  querySku() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/sku/all/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.skus = data.data;
      });
  }

  //加载参数信息
  querySimpleAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/simple/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.simpleCavs = data.data;
      });
  }

  queryMulAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/mul/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        //注意编译后的指令重排序,完全无法理解这个ＴＳ编译器
        const cavs: Array<SSMap> = data.data;
        let i = 0;
        let flag = false;
        cavs.forEach((cav1) => {
          if (!this.mulCavs) {
            this.mulCavs = new Array();
            this.mulCavs.push(cav1);
          } else {
            this.mulCavs.forEach((cav2) => {
              if (cav1.attributeName == cav2.attributeName) {
                this.mulCavs[i].attributeValue = cav2.attributeValue + "," + cav1.attributeValue;
                flag = true;
              }
              i++;
            });
            if (!flag) {
              this.mulCavs.push(cav1);
            } else {
              flag = false;
            }
            i = 0;
          }
        });
      });
  }

  //查询审核详细信息
  queryCheckInf() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/incheck/detail/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.inCheckDetail = data.data;
      });
  }

  //关闭模态框
  dismiss() {
    this.modalController.dismiss();
  }


}
