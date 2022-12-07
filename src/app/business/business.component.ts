import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit, OnDestroy {

  session: WebSocket;
  constructor() { }

  ngOnDestroy(): void {
    if (this.session) {
      this.session.close();
    }
  }

  ngOnInit() {
    this.buildSocketLink();
  }


  //建立websocket连接
  buildSocketLink() {
    let webS = "sellerWeb";
    let url = GlobalFinal.WEBSOCKET_DOMAIN;
    if (localStorage.getItem(webS) == null) {
      localStorage.setItem(webS, 0 + "");
    }
    if (parseInt(localStorage.getItem(webS) + "") == 0) {
      //获取websocket观察对象
      if (localStorage.getItem("consumer") != null) {
        const temp = GlobalFinal.createWebSocket(url + "/websocket/seller/" + JSON.parse(localStorage.getItem("consumer") + "").phone, webS);
        this.session = temp.session;
        temp.sessionOb.subscribe((data: any) => {
          GlobalALert.getToast("你有新的消息");
        });
      }
    }
  }

}
