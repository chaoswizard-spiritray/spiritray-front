import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { GlobalALert } from '../../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../../service/store-router-data.service';
import { AddressComponent } from './address/address.component';
import { InfComponent } from './inf/inf.component';
import { ModifyPdComponent } from './modify-pd/modify-pd.component';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.scss']
})
export class SetComponent implements OnInit {

  constructor(
    private modalContrller: ModalController,
    private navController: NavController,
    private hr: HttpClient,
    private ui: StoreRouterDataService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  //回退
  dismiss() {
    this.navController.back();
  }

  //打开信息修改模态框
  async openInf() {
    const modal = await this.modalContrller.create({
      component: InfComponent,//模态框中展示的组件
      handle: false,
      initialBreakpoint: 0.8,
      breakpoints: [0.2, 0.5, 0.8, 0.9],
      swipeToClose: true,
      presentingElement: await this.modalContrller.getTop()
    });
    return await modal.present();
  }

  //打开地址模态框
  async openAddress() {
    const modal = await this.modalContrller.create({
      component: AddressComponent,//模态框中展示的组件
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalContrller.getTop()
    });
    return await modal.present();
  }

  //修改密码
  async openPassword() {
    //创建节点
    const popover = await this.popoverController.create({
      component: ModifyPdComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      arrow: true
    });
    await popover.present();
  }

  //退出登录
  openLogOut() {
    //清除缓存
    localStorage.clear();
    GlobalALert.getToast("已退出");
    this.navController.navigateForward('');
  }

}
