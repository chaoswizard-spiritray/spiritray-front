import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { GlobalFinal, NoSellDetail, Sku, SSMap } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-no-sell-detail',
  templateUrl: './no-sell-detail.component.html',
  styleUrls: ['./no-sell-detail.component.scss'],
})
export class NoSellDetailComponent implements OnInit {

  @Input() commodityId: string;

  noSellDetail: NoSellDetail;

  skus: Array<Sku>;

  simpleCavs: Array<SSMap>;

  mulCavs: Array<SSMap>;

  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.queryCheckInf();
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
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/nosell/detail/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.noSellDetail = data.data[0];
      });
  }

  //关闭模态框
  dismiss() {
    this.modalController.dismiss();
  }
}
