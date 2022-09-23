import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pay-over',
  templateUrl: './pay-over.component.html',
  styleUrls: ['./pay-over.component.scss'],
})
export class PayOverComponent implements OnInit {

  timeTrmier: number = 10;

  timer;

  constructor(
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    const el = document.getElementsByTagName("ion-checkbox")[0];
    setTimeout(() => { el.setAttribute("checked", "true") }, 300);
    this.timing();
  }

  //计时指定时间后自动跳转
  timing() {
    this.timer = setInterval(() => {
      if (this.timeTrmier > 0) {
        this.timeTrmier--;
      } else {
        this.skip();
      }
    }, 1000);
  }

  //定时取消并页面跳转
  skip() {
    clearInterval(this.timer);
    location.replace("/consumer/home");
  }

}
