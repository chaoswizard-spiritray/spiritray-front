import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detail-show',
  templateUrl: './detail-show.component.html',
  styleUrls: ['./detail-show.component.scss'],
})
export class DetailShowComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }
  //取消模态框
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
