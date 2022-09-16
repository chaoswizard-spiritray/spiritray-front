import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Consumer, GlobalFinal } from '../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../service/store-router-data.service';
import { ConsumerOrderComponent } from './consumer-order/consumer-order.component';

@Component({
  selector: 'app-myspirit',
  templateUrl: './myspirit.component.html',
  styleUrls: ['./myspirit.component.scss'],
})
export class MyspiritComponent implements OnInit, AfterViewInit {
  //入驻文字
  enter = "入驻";
  constructor(
    private router: Router,
    private hr: HttpClient,
    private ui: StoreRouterDataService,
    private modalController: ModalController
  ) { }


  //初始化组件时调用请求数据，因为是观察者模式所以不会产生数据页面初始化异常问题
  ngOnInit() {
    // 加载用户信息
    this.queryConsumerInf();
  }

  //当组件已经初始化完成之后我们再启动页面特效，防止特效失效
  ngAfterViewInit() {
    //开启一个子线程进行运行防止冲突
    const pro = new Promise(() => {
      // 组件初始化后开始缩放
      this.play(document.getElementById("enter"));
    });
  }

  // 入驻图标缩放
  play(obj): void {
    var trs = obj.style;
    var flag: boolean = true;
    setInterval(() => {
      if (flag) {
        trs.transition = "transform .5s ease 0s";
        trs.transform = "scale(1.1,1.1)";
      } else {
        trs.transition = "transform .5s ease 0s";
        trs.transform = "scale(1,1)";
      }
      flag = !flag;
    }, 1000);
  }

  //入驻
  toStore() {
    if (this.ui.userInf != null && this.ui.userInf.isEnter == 1) {
      //如果已经入驻就跳转store
      this.router.navigateByUrl("/business/store/welcome");
    } else {
      //否则就跳转enter验证
      this.router.navigateByUrl("/business/enter");
    }
  }

  //加载用户信息
  queryConsumerInf() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/info", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.ui.userInf = data.data;
        }
        //判断用户是否入驻
        if (this.ui.userInf.isEnter == 1 || localStorage.getItem("storeId") != null) {
          this.enter = "我的店铺";
          var icon: any = document.getElementsByClassName("icons")[0].lastChild;
          //调整位置
          icon.style.marginLeft = "-9px";
        }
      });
  }

  //开启设置
  openSet() {
    this.router.navigateByUrl("/consumer/set");
  }

  //开启订单信息
  async toOrder(index) {
    const modal = await this.modalController.create({
      component: ConsumerOrderComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'flag': index
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }
}
