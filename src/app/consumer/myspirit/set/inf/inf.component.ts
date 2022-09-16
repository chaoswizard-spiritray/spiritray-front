import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../../../service/store-router-data.service';
import { ModifyNicknameComponent } from './modify-nickname/modify-nickname.component';
import { ModifySexComponent } from './modify-sex/modify-sex.component';
import { Clipboard } from '@ionic-native/clipboard';
@Component({
  selector: 'app-inf',
  templateUrl: './inf.component.html',
  styleUrls: ['./inf.component.scss'],
})
export class InfComponent implements OnInit {
  constructor(
    private modalContrller: ModalController,
    private hr: HttpClient,
    private ui: StoreRouterDataService,
    private popoverController: PopoverController,
    private platform: Platform,
    private toast: ToastController
  ) { }

  ngOnInit() { }

  //取消模态框
  dismiss() {
    this.modalContrller.dismiss({
      'dismissed': true
    });
  }

  //修改头像
  upload(event) {
    let file = event.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file, file.name);
    formdata.append("imgPath", this.ui.userInf.consumerHead);
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/head", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.data != null) {
          this.ui.userInf.consumerHead = data.data.consumerHead;
        }
      });
  }

  //修改昵称信息
  async modifyNickName() {
    //创建节点
    const popover = await this.popoverController.create({
      component: ModifyNicknameComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      arrow: true
    });
    await popover.present();
  }

  //修改性别信息
  async modifySex() {
    //创建节点
    const popover = await this.popoverController.create({
      component: ModifySexComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      arrow: true
    });
    await popover.present();
  }

  //复制电话
  async copyPhone() {
    if (this.platform.is("cordova")) {
      Clipboard.copy(this.ui.userInf.consumerPhone + "").then(async () => {
        await this.toast.create({
          message: "已复制",
          duration: 500
        }).then(e => {
          e.present();
        });
      });
    } else {
      await this.toast.create({
        message: '已复制',
        duration: 500
      }).then(e => {
        e.present();
      });
    }
  }
}
