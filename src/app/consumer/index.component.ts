import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';

// https://blog.csdn.net/wzh66888/article/details/92431171
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {

  checkIndex = 0;

  barStyle = "";
  session: WebSocket;
  constructor(
    private router: Router
  ) { }

  ngOnDestroy(): void {
    if (this.session) {
      this.session.close();
    }
  }


  ngOnInit() {
    //获取当前路由
    const url = this.router.routerState.snapshot.url;
    // 判断地址
    if (url === "/consumer/home") {
      this.checkIndex = 0;
      this.barStyle = "";
    }
    if (url === "/consumer/msg") {
      this.checkIndex = 1;
      this.barStyle = "";
    }
    if (url === "/consumer/cart") {
      this.checkIndex = 2;
      this.barStyle = "";
    }
    if (url === "/consumer/myspirit") {
      this.checkIndex = 3;
      this.barStyle = "--background: rgb(245, 219, 219);";
    }
    this.buildSocketLink();
  }

  change(index) {
    if (index !== this.checkIndex) {
      //修改选中的图标
      this.checkIndex = index;
      if (this.checkIndex == 3) {
        this.barStyle = "--background: rgb(245, 219, 219);";
      } else {
        this.barStyle = "";
      }
    }
  }

  //建立websocket连接
  buildSocketLink() {
    //如果已经连接了，就不用
    let webS = "consumerWeb";
    let url = GlobalFinal.WEBSOCKET_DOMAIN;
    if (localStorage.getItem(webS) == null) {
      localStorage.setItem(webS, 0 + "");
    }
    if (parseInt(localStorage.getItem(webS) + "") == 0) {
      //获取websocket观察对象
      if (localStorage.getItem("consumer") != null) {
        const temp = GlobalFinal.createWebSocket(url + "/websocket/consumer/" + JSON.parse(localStorage.getItem("consumer") + "").phone, webS);
        this.session = temp.session;
        temp.sessionOb.subscribe((data: any) => {
          GlobalALert.getToast("你有新的消息");
        });
      }
    }
  }
}
