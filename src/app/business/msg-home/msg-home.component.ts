import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-msg-home',
  templateUrl: './msg-home.component.html',
  styleUrls: ['./msg-home.component.scss'],
})
export class MsgHomeComponent implements OnInit {

  flag: number = 0;//0平台、1买家、2商家

  msgHomeInfo;//消息页信息

  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data) => {
      console.log(data);

    });
  }

  //获取消息页消息
  queryMsgHomeInfo() {

  }

  // 建立细节的webjsocket连接

}
