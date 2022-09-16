import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';
import { CodeInputComponent } from './code-input/code-input.component';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.scss'],
})
export class LogonComponent implements OnInit {
  staffId: String;

  show: boolean;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if (localStorage.getItem("staffId") != null) {
      this.staffId = localStorage.getItem("staffId") + "";
    }
  }

  //检测账号，并发送邮箱验证码
  submit() {
    if (GlobalFinal.IS_EXIST.includes(this.staffId.trim()) || this.staffId.length != 13) {
      GlobalALert.getAlert({ message: '信息填写不合法' });
    }
    //发送验证码
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/logon/code/" + this.staffId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          //打开模态框
          setTimeout(() => { this.showModal(); }, 500);
        }
      });
  }

  //验证码
  async showModal() {
    const modal = await this.modalController.create({
      component: CodeInputComponent,//模态框中展示的组件
      handle: false,
      componentProps: {
        'inputNum': 6,
        'msg': '邮箱验证码',
        'staffId': this.staffId
      },
      initialBreakpoint: 0.9,
      breakpoints: [0.4, 0.6, 0.9],
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    return await modal.present();
  }
}
