import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
})
export class PlantComponent implements OnInit {

  session: WebSocket;
  constructor(
    private router: Router,
  ) { }

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
    let webS = "plantWeb";
    let url = GlobalFinal.WEBSOCKET_DOMAIN;
    if (localStorage.getItem(webS) == null) {
      localStorage.setItem(webS, 0 + "");
    }
    if (parseInt(localStorage.getItem(webS) + "") == 0) {
      //获取websocket观察对象
      const temp = GlobalFinal.createWebSocket(url + "/websocket/plant/" + 0, webS);
      this.session = temp.session;
      temp.sessionOb.subscribe((data: any) => {
        GlobalALert.getToast("你有新的消息");
        console.log(
          this.router.url
        );
      });
    }
  }

}
