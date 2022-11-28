import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
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
  //各类订单的数目统计
  noPayNum = 0;
  payNum = 0;
  noTakeNum = 0;
  noCommentNum = 0;
  constructor(
    private router: Router,
    private hr: HttpClient,
    private ui: StoreRouterDataService,
    private modalController: ModalController,
    private navController: NavController) { }


  //初始化组件时调用请求数据，因为是观察者模式所以不会产生数据页面初始化异常问题
  ngOnInit() {
  }

  ionViewWillEnter() {
    // 加载用户信息
    this.queryConsumerInf();
    //加载各类订单数目
    this.queryOrderNum();
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
          //将信息缓存
          const temp = {
            "phone": data.data.consumerPhone,
            "name": data.data.consumerName,
            "head": data.data.consumerHead
          }
          localStorage.setItem("consumer", JSON.stringify(temp));
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

  //加载订单数目
  queryOrderNum() {
    //加载之前先清空数据,否则会渲染失败
    this.noPayNum = 0;
    this.payNum = 0;
    this.noTakeNum = 0;
    this.noCommentNum = 0;
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/count/consumer", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.stausCode == 200) {
        data.data.forEach(element => {
          switch (element.key) {
            case 0: this.noPayNum = element.value; break;
            case 1: this.payNum = element.value; break;
            case 2: this.noTakeNum = element.value; break;
            case 3: this.noCommentNum = element.value; break;
          }
        });
      }
    });
  }

  //开启设置
  openSet() {
    this.router.navigateByUrl("/consumer/set");
  }

  // //开启订单信息
  toOrder(index) {
    //先获取订单页面观测对象并启动观测
    this.router.navigate(['/consumer/order'], {
      queryParams: {
        "flag": index
      }
    });
  }

}
