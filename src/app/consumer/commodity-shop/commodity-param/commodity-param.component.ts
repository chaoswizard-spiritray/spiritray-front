import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalFinal, SSMap } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-commodity-param',
  templateUrl: './commodity-param.component.html',
  styleUrls: ['./commodity-param.component.scss'],
})
export class CommodityParamComponent implements OnInit {

  @Input() commodityId: string;

  simpleCavs: Array<SSMap>;

  mulCavs: Array<SSMap>;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.queryMulAttribute();
    this.querySimpleAttribute();
  }

  //加载参数信息
  querySimpleAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/simple/" + this.commodityId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.simpleCavs = data.data;
      });
  }

  queryMulAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/mul/" + this.commodityId, GlobalFinal.JWTHEADER)
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

  //关闭模态框
  dismiss() {
    this.modalController.dismiss();
  }

}
