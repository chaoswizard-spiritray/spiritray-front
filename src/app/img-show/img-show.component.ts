import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-img-show',
  templateUrl: './img-show.component.html',
  styleUrls: ['./img-show.component.scss'],
})
export class ImgShowComponent implements OnInit {
  @Input() url: string;
  constructor(
    private modalContrller: ModalController
  ) { }

  ngOnInit() {
  }

  //取消模态框
  dismiss() {
    this.modalContrller.dismiss({
      'dismissed': true
    });
  }

}
