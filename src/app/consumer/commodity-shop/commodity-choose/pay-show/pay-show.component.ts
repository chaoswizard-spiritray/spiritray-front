import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, SSMap } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-pay-show',
  templateUrl: './pay-show.component.html',
  styleUrls: ['./pay-show.component.scss'],
})
export class PayShowComponent implements OnInit {
  accaId: number = 1;

  msg: string = "";

  orderId: string;

  flag = true;

  timer;


  constructor(
    private hr: HttpClient,
    private router: Router,
    private navController: NavController,
    private activedRouted: ActivatedRoute
  ) { }

  ngOnInit() {
    //解析参数
    this.activedRouted.queryParams.subscribe(data => {
      this.accaId = data.accaId;
      this.msg = data.msg;
      this.orderId = data.orderId;
    });
  }

  //填写完成之后请求付款信息
  onCodeCompleted(code: string) {
    const body = new SSMap(this.orderId, this.msg);
    const formdata = new FormData();
    formdata.append("body", JSON.stringify(body));
    formdata.append("payState", 1 + "");
    formdata.append("password", code);
    if (this.accaId == 1) {
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/pay/app/order/state/ali", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
        if (data.stausCode == 200) {
          this.queryOrderState(data.msg);
        }
      });
    } else if (this.accaId == 2) {
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/pay/app/order/state/wechat", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
        if (data.stausCode == 200) {
          this.queryOrderState(data.msg);
        }
      });
    } else {

    }
  }

  //循环检测服务端订单状态是否付款成功
  queryOrderState(msg) {
    while (this.flag) {
      this.timer = setTimeout(() => {
        this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/state/" + this.orderId, GlobalFinal.JWTHEADER)
          .subscribe((data: any) => {
            if (data.data == 1) {
              this.flag = false;
              GlobalALert.getToast(msg);
              this.toSuccess();
            }
          });
      }, 1200);
      this.flag = false;
    }
    GlobalALert.getToast(msg);
    //打开支付完成对话框
    this.toSuccess();
  }

  //支付成功
  toSuccess() {
    //关闭定时器
    clearTimeout(this.timer);
    //跳转支付成功界面
    this.router.navigate(['/consumer/shop/choose/pay-over']);
  }

  //取消支付
  dismiss() {
    //停止检测
    this.flag = false;
    clearTimeout(this.timer);
    //封装数据
    const body = new SSMap(this.orderId, this.msg);
    const formdata = new FormData();
    formdata.append("body", JSON.stringify(body));
    formdata.append("payState", -1 + "");
    formdata.append("password", "");
    if (this.accaId == 1) {
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/pay/app/order/state/ali", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
      });
    } else if (this.accaId == 2) {
      this.hr.put(GlobalFinal.ORDER_DOMAIN + "/pay/app/order/state/wechat", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
      });
    } else {

    }
    this.navController.back();
  }

}
