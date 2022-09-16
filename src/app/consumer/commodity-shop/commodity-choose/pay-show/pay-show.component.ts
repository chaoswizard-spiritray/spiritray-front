import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalALert, GlobalFinal, SSMap } from '../../../../dto-model/dto-model.component';
import { PayOverComponent } from '../pay-over/pay-over.component';

@Component({
  selector: 'app-pay-show',
  templateUrl: './pay-show.component.html',
  styleUrls: ['./pay-show.component.scss'],
})
export class PayShowComponent implements OnInit {
  @Input() accaId: number = 1;

  @Input() msg: string = "";

  @Input() orderId: string;

  flag = true;

  timer;


  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() { }


  //填写完成之后请求付款信息
  onCodeCompleted(code: string) {
    const body = new SSMap(this.orderId, this.msg);
    console.log(body);

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
      setTimeout(() => {
        this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/state/" + this.orderId, GlobalFinal.JWTHEADER)
          .subscribe((data: any) => {
            console.log(data);
            if (data.data == 1) {
              this.flag = false;
              GlobalALert.getToast(msg);
              this.toSuccess();
            }
          });
      }, 1200);
      this.flag = false;
    }
    //GlobalALert.getToast(msg);
    //打开支付完成对话框
  }

  //支付成功
  async toSuccess() {
    const modal = await this.modalController.create({
      component: PayOverComponent,//模态框中展示的组件
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.modalController.dismiss();
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
    this.modalController.dismiss();
  }

}
