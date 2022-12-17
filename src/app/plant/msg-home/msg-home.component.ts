import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { GlobalFinal } from '../../dto-model/dto-model.component';
import { MsgDetailComponent } from '../../msg-detail/msg-detail.component';

@Component({
  selector: 'app-msg-home',
  templateUrl: './msg-home.component.html',
  styleUrls: ['./msg-home.component.scss'],
})
export class MsgHomeComponent implements OnInit {
  senderId = 0;

  msgHomeInfos;//消息页信息

  session: WebSocket;

  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    //拉取信息
    this.queryMsgHomeInfos();
    //建立连接
    this.buildSocketLink();
  }

  ionViewWillLeave() {
    //将要离开视图时，关闭连接
    if (this.session) {
      this.session.close();
    }
  }

  //获取消息页消息
  queryMsgHomeInfos() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/msg/home/" + this.senderId + "/0").subscribe((data: any) => {
      if (data.data != null && data.data.length > 0) {
        this.msgHomeInfos = data.data;
      }
    });
  }

  //打开指定消息细节
  //打开消息模态框
  async openMsgDetail(index) {
    //打开消息细节模态框
    const modal = await this.modalController.create({
      component: MsgDetailComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'receiverName': this.msgHomeInfos[index].sendName,
        'receiverHead': this.msgHomeInfos[index].sendHead,
        'receiverRole': this.msgHomeInfos[index].senderRole,
        'receiverId': this.msgHomeInfos[index].sender,
        'senderRole': 0
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.queryMsgHomeInfos();
  }


  buildSocketLink() {
    let webS = "plantHomeWeb";
    let url = GlobalFinal.WEBSOCKET_DOMAIN;
    if (localStorage.getItem(webS) == null) {
      localStorage.setItem(webS, 0 + "");
    }
    if (parseInt(localStorage.getItem(webS) + "") == 0) {
      //获取websocket观察对象
      const temp = GlobalFinal.createWebSocket(url + "/websocket/plant/home/" + this.senderId, webS);
      this.session = temp.session;
      temp.sessionOb.subscribe((data: any) => {
        this.queryMsgHomeInfos();
      });
    }
  }
}
