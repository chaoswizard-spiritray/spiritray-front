import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-msg-home',
  templateUrl: './msg-home.component.html',
  styleUrls: ['./msg-home.component.scss'],
})
export class MsgHomeComponent implements OnInit {
  senderId = 0;

  msgHomeInfos;//消息页信息

  websocket;//连接套接字

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
    //初始化id
    this.senderId = JSON.parse(localStorage.getItem("consumer") + "").phone;
    //拉取信息
    this.queryMsgHomeInfos();
    //建立连接
    this.buildSocketLink();
  }

  ionViewWillLeave() {
    //将要离开视图时，关闭连接
    this.websocket.close();
  }

  //获取消息页消息
  queryMsgHomeInfos() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/msg/home/" + this.senderId + "/1").subscribe((data: any) => {
      console.log(data);
      if (data.data.length > 0) {


        this.msgHomeInfos = data.data;
      }
    });
  }

  // 建立细节的webjsocket连接
  buildSocketLink() {
    //如果已经连接了，就不用
    if (localStorage.getItem("consumerHomeWeb") == null) {
      localStorage.setItem("consumerHomeWeb", 0 + "");
    }
    if (parseInt(localStorage.getItem("consumerHomeWeb") + "") == 0)
      //判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        //获取买家的电话
        this.websocket = new WebSocket(GlobalFinal.WEBSOCKET_DOMAIN + "/websocket/consumer/home/" + this.senderId);
      }
      else {
        GlobalALert.getToast("无法连接");
      }

    //连接发生错误的回调方法
    this.websocket.onerror = function () {
      GlobalALert.getToast("连接错误");
      localStorage.setItem("consumerHomeWeb", 0 + "");
    };

    //连接成功建立的回调方法
    this.websocket.onopen = function () {
      console.log("index连接成功");
      localStorage.setItem("consumerHomeWeb", 1 + "");
    }

    //接收到消息的回调方法
    this.websocket.onmessage = function (event) {
      //setMessageInnerHTML(event.data);
      //当有消息推送过来,重新请求一遍
      this.queryMsgHomeInfos();
    }

    //连接关闭的回调方法
    this.websocket.onclose = function () {
      console.log("index连接已关闭");
      localStorage.setItem("consumerHomeWeb", 0 + "");
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
      closeWebSocket();
    }

    //关闭WebSocket连接
    function closeWebSocket() {
      this.websocket.close();
    }
  }
}
