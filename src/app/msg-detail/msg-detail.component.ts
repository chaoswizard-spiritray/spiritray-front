import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';
/**
 * 
 * ionViewWillEnter	当组件路由到即将以动画形式显示在视图中时触发。
ionViewDidEnter	当组件路由到完成动画处理时触发。
ionViewWillLeave	当组件路由从中即将进行动画处理时触发。
ionViewDidLeave	当组件路由到完成动画处理时触发。
 */
@Component({
  selector: 'app-msg-detail',
  templateUrl: './msg-detail.component.html',
  styleUrls: ['./msg-detail.component.scss'],
})
export class MsgDetailComponent implements OnInit {
  @Input() receiverName = "";

  @Input() receiverHead = "";

  @Input() receiverRole = 0;

  @Input() receiverId = 0;

  @Input() senderRole = 0;

  senderName = "";
  senderHead = "";
  senderId = 0;

  pageNo = 0;

  pageNum = 5;

  msgText = "";//输入的消息

  file

  msgs;

  websocket;//消息套接字

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;//滚动条


  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    //初始化发送者头部信息以及名称
    if (this.senderRole == 1) {
      const consumer = JSON.parse(localStorage.getItem("consumer") + "");
      this.senderName = consumer.name;
      this.senderHead = consumer.head;
      this.senderId = consumer.phone;
    } else if (this.senderRole == 2) {
      const store = JSON.parse(localStorage.getItem("store") + "");
      this.senderName = store.name;
      this.senderHead = store.head;
      this.senderId = store.phone;
    }
    //组件初始化时建立
    this.buildSocketLink();
    //加载消息
    this.queryDetail();
  }

  //加载消息
  queryDetail() {
    let s: Array<any>;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/msg/" + this.receiverId + "/" + this.pageNo + "/" + this.pageNum, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        console.log(data);
        if (this.msgs === undefined) {
          this.msgs = new Array();
        }
        const temp = data.data;
        this.msgs = temp.concat(...this.msgs);
      });
  }

  //发送图片消息
  upload(event) {
    let file = event.target.files[0];
    const msg = {
      'msgId': '',
      'sender': this.senderId,
      'receiver': this.receiverId,
      'senderRole': 1,
      'receiverRole': 2,
      'msg': '',
      'msgType': 'img',
      'isRead': 0,
      'sendDate': new Date(),
      'isDelete': 0
    }
    let formdata = new FormData();
    formdata.append("file", file, file.name);
    formdata.append("msg", JSON.stringify(msg));
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/msg/send", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        //将消息追加到msgs中
        if (this.msgs === undefined) {
          this.msgs = new Array();
        }
        this.msgs.push(data.data);
        //滚动到底部
        this.content.scrollToBottom(500);
      });
  }
  //发送文字消息
  sendMsg() {
    const msg = {
      'msgId': '',
      'sender': this.senderId,
      'receiver': this.receiverId,
      'senderRole': 1,
      'receiverRole': 2,
      'msg': this.msgText,
      'msgType': 'text',
      'isRead': 0,
      'sendDate': new Date(),
      'isDelete': 0
    }
    this.msgText = "";
    let formdata = new FormData();
    formdata.append("msg", JSON.stringify(msg));
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/msg/send", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        //将消息追加到msgs中
        if (this.msgs === undefined) {
          this.msgs = new Array();
        }
        this.msgs.push(data.data);
        //滚动到底部
        this.content.scrollToBottom(500);
      });
  }

  dismiss() {
    this.modalController.dismiss();
    //关闭websoclet连接
    this.websocket.close();
  }

  //建立消息细节websocket连接
  buildSocketLink() {
    //如果已经连接了，就不用
    if (localStorage.getItem("consumerDetailWeb") == null) {
      localStorage.setItem("consumerDetailWeb", 0 + "");
    }
    if (parseInt(localStorage.getItem("consumerDetailWeb") + "") == 0)
      //判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        //获取买家的电话
        this.websocket = new WebSocket(GlobalFinal.WEBSOCKET_DOMAIN + "/websocket/consumer/detail/" + this.senderId);
      }
      else {
        GlobalALert.getToast("无法连接");
      }

    //连接发生错误的回调方法
    this.websocket.onerror = function () {
      GlobalALert.getToast("连接错误");
      localStorage.setItem("consumerDetailWeb", 0 + "");
    };

    //连接成功建立的回调方法
    this.websocket.onopen = function () {
      console.log("index连接成功");
      localStorage.setItem("consumerDetailWeb", 1 + "");
    }

    //接收到消息的回调方法
    this.websocket.onmessage = function (event) {
      //setMessageInnerHTML(event.data);
      GlobalALert.getToast("您收到一条消息");
    }

    //连接关闭的回调方法
    this.websocket.onclose = function () {
      console.log("index连接已关闭");
      localStorage.setItem("consumerDetailWeb", 0 + "");
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
