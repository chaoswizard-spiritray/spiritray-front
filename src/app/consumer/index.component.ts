import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  checkIndex = 0;

  barStyle = "";

  constructor(
    private router: Router
  ) { }

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
    if (localStorage.getItem("consumerWeb") == null) {
      localStorage.setItem("consumerWeb", 0 + "");
    }
    if (parseInt(localStorage.getItem("consumerWeb") + "") == 0 && localStorage.getItem("consumer") !== null) {
      let websocket;
      //判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        //获取买家的电话
        websocket = new WebSocket(GlobalFinal.WEBSOCKET_DOMAIN + "/websocket/consumer/" + JSON.parse(localStorage.getItem("consumer") + "").phone);
      }
      else {
        GlobalALert.getToast("无法连接");
      }

      //连接发生错误的回调方法
      websocket.onerror = function () {
        GlobalALert.getToast("连接错误");
        localStorage.setItem("consumerWeb", 0 + "");
      };

      //连接成功建立的回调方法
      websocket.onopen = function () {
        console.log("index连接成功");
        localStorage.setItem("consumerWeb", 1 + "");
      }

      //接收到消息的回调方法
      websocket.onmessage = function (event) {
        //setMessageInnerHTML(event.data);
        GlobalALert.getToast("您收到一条消息");
      }

      //连接关闭的回调方法
      websocket.onclose = function () {
        console.log("index连接已关闭");
        localStorage.setItem("consumerWeb", 0 + "");
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        closeWebSocket();
      }

      //关闭WebSocket连接
      function closeWebSocket() {
        websocket.close();
      }
    }
  }
}
