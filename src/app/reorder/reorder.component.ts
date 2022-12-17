import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-reorder',
  templateUrl: './reorder.component.html',
  styleUrls: ['./reorder.component.scss'],
})
export class ReorderComponent implements OnInit {

  @Input() type = 0;//需要展示什么类型的筛选条件
  @Input() childType = 0;//具体类型下的子类型，如店铺订单下的未付款，已付款

  checkReorderValue = "";


  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
  }

  /**
   * 关闭模态框
   */
  dismiss(isReturn) {
    if (isReturn == -1) {
      this.modalController.dismiss();
    } else {
      this.navParams.data.modal.dismiss({ 'reorder': this.checkReorderValue });
    }
  }

}
