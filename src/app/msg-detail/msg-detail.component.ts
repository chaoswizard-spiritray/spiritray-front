import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';
import { ImgShowComponent } from '../img-show/img-show.component';
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
export class MsgDetailComponent implements OnInit, OnDestroy {
  @Input() receiverName = "";

  @Input() receiverHead = "";

  @Input() receiverRole = 0;

  @Input() receiverId = 0;

  @Input() senderRole = 0;

  systemHead = "../../assets/icon/favicon.png";

  senderName = "";
  senderHead = "";
  senderId = 0;

  pageNo = 0;

  pageNum = 8;

  msgText = "";//输入的消息

  file

  msgs;

  head;

  session;//消息套接字

  loadText: string = "加载更多";

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;//滚动条

  topHidden: boolean = false;
  scrollTop: any;


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
    this.head = GlobalFinal.JWTHEADER;
    switch (this.senderRole) {
      case 0: {
        this.head = GlobalFinal.PLAT_HEADER;
      }; break;
      case 2: {
        this.head = GlobalFinal.STORE_HEADER;
      }; break;
    }
  }

  ionViewDidEnter() {
    //组件初始化时建立
    this.buildSocketLink();
    //加载消息
    this.queryDetail();
  }

  ngOnDestroy() {
    if (this.session) {
      this.session.close();
    }
  }

  //加载更多消息
  loadMore() {
    //隐藏
    this.topHidden = true
    this.pageNo++;
    this.queryDetail();
  }

  // 监听内容滚动
  scroll(event: CustomEvent) {
    this.scrollTop = event.detail.scrollTop;
    if (event.detail.currentY <= 5) {
      this.loadMore();
    }
  }

  scrollEnd() {
    // if (this.scrollTop < 1) {
    //   this.topHidden == true;
    // } else {
    //   if (!this.topHidden)
    //     this.topHidden = false;
    // }
  }

  //显示图片全屏
  async showAll(license) {
    const modal = await this.modalController.create({
      component: ImgShowComponent,//模态框中展示的组件
      componentProps: {
        "url": license
      }
    });
    return await modal.present();
  }


  //加载消息
  queryDetail() {
    let s: Array<any>;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/msg/" + this.receiverId + "/" + this.pageNo + "/" + this.pageNum, this.head)
      .subscribe((data: any) => {
        this.topHidden = true;
        if (this.msgs === undefined) {
          this.msgs = new Array();
        }
        const temp = data.data;
        //修改订单阅读状态
        if (data.data != null && data.data.length > 0) {
          temp.forEach((s) => {
            if (s.isRead == 0 && s.senderRole == this.receiverRole) {
              this.hr.put(GlobalFinal.PLANT_DOMAIN + "/msg/readed/" + s.msgId, this.head).subscribe((data: any) => {
                s.isRead = 1;
              });
            }
          });
          this.msgs = temp.concat(...this.msgs);
          //滚动到底部
          if (this.pageNo == 0) {
            this.content.scrollToBottom(500);
          }
          this.topHidden = false;
          this.loadText = "更多消息"
        } else {
          this.topHidden = false;
          this.loadText = "没有更多"
        }
      });
  }

  //发送图片消息
  upload(event) {
    let file = event.target.files[0];
    const msg = {
      'msgId': '',
      'sender': this.senderId,
      'receiver': this.receiverId,
      'senderRole': this.senderRole,
      'receiverRole': this.receiverRole,
      'msg': '',
      'msgType': 'img',
      'isRead': 0,
      'sendDate': new Date(),
      'isDelete': 0
    }
    let formdata = new FormData();
    formdata.append("file", file, file.name);
    formdata.append("msg", JSON.stringify(msg));
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/msg/send", formdata, this.head)
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
      'senderRole': this.senderRole,
      'receiverRole': this.receiverRole,
      'msg': this.msgText,
      'msgType': 'text',
      'isRead': 0,
      'sendDate': new Date(),
      'isDelete': 0
    }
    this.msgText = "";
    let formdata = new FormData();
    formdata.append("msg", JSON.stringify(msg));
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/msg/send", formdata, this.head)
      .subscribe((data: any) => {
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
    if (this.session) {
      this.session.close();
    }
  }

  //建立消息细节websocket连接
  buildSocketLink() {
    //如果已经连接了，就不用
    let webS = "";
    let url = GlobalFinal.WEBSOCKET_DOMAIN;
    switch (this.senderRole) {
      case 0: {
        webS = "plantDetailWeb";
        url = url + "/websocket/plant/detail/" + this.senderId;
      }; break;
      case 1: {
        webS = "consumerDetailWeb";
        url = url + "/websocket/consumer/detail/" + this.senderId;
      }; break;
      case 2: {
        webS = "sellerDetailWeb";
        url = url + "/websocket/seller/detail/" + this.senderId;
      }; break;
    }
    if (localStorage.getItem(webS) == null) {
      localStorage.setItem(webS, 0 + "");
    }
    if (parseInt(localStorage.getItem(webS) + "") == 0) {
      //获取websocket观察对象
      const temp = GlobalFinal.createWebSocket(url, webS);
      this.session = temp.session;
      temp.sessionOb.subscribe((data: any) => {
        let sId: string = data;
        if (sId.indexOf("is-readed") > 0) {
          sId = sId.replace("is-readed", "");
          setTimeout(() => {
            for (let i = 0; i < this.msgs.length; i++) {
              if (sId == this.msgs[i].msgId) {
                this.msgs[i].isRead = 1;
                return;
              }
            }
          }, 700);
        } else {
          const ms = JSON.parse(data);
          //修改信息读取状态
          this.hr.put(GlobalFinal.PLANT_DOMAIN + "/msg/readed/" + ms.msgId, this.head)
            .subscribe((data: any) => { ms.isRead = 1; });
          this.msgs.push(ms);
          this.content.scrollToBottom(500);
        }
      });
    }
  }
}
