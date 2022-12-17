import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, InCheckDetail } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-check-detail',
  templateUrl: './check-detail.component.html',
  styleUrls: ['./check-detail.component.scss'],
})
export class CheckDetailComponent implements OnInit {

  @Input() commodityId: string;

  inCheckDetail: InCheckDetail;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.queryCheckInf();
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
  //修改商品名称
  modifyCommodityName() {

  }

  //移除商品
  async deleteNoPassCheckCommodity() {
    if (await GlobalALert.getSureAlert("确定要移除该商品吗") != "confirm") {
      return;
    }
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/seller/check/remove", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      GlobalALert.getAlert({ message: data.msg });
      if (data.stausCode == 200) {
        this.modalController.dismiss();
      }
    });
  }

  //重新申请
  async reapplyCeck() {
    if (await GlobalALert.getSureAlert("确定要重新申请审核吗") != "confirm") {
      return;
    }
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/commodity/seller/check/reapply", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      GlobalALert.getAlert({ message: data.msg });
      if (data.stausCode == 200) {
        this.modalController.dismiss();
      }
    });
  }

}
