import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalFinal, InCheckDetail } from '../../../../dto-model/dto-model.component';

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
    private modalController: ModalController
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

}
