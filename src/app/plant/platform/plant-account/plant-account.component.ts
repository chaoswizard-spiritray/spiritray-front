import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountCategory, GlobalALert, GlobalFinal, PlantAccount } from '../../../dto-model/dto-model.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { SetAccountComponent } from './set-account/set-account.component';

@Component({
  selector: 'app-plant-account',
  templateUrl: './plant-account.component.html',
  styleUrls: ['./plant-account.component.scss'],
})
export class PlantAccountComponent implements OnInit {

  cates: Array<AccountCategory>;

  //商家的账户信息
  accounts: Array<PlantAccount> = [];

  //当前加载的类型
  nowAccountCategory; number = 0;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.queryAccountCate();
    setTimeout(() => { this.queryPlantAccount(0) }, 500);
  }

  //请求平台支付种类
  queryAccountCate() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/account/category", GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.cates = data.data;
      });
  }

  //加载平台账户信息
  queryPlantAccount(index) {
    this.nowAccountCategory = index;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/account/all/" + this.cates[index].accaId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.accounts = data.data;
        }
      });
  }

  //显示提示框
  showTip() {
    GlobalALert.getAlert({ message: "平台已禁用该支付方式" });
  }

  //添加账户
  async addAccount() {
    const modal = await this.modalController.create({
      component: AddAccountComponent,
      componentProps: {
        accaId: this.cates[this.nowAccountCategory].accaId
      }
    });
    return await modal.present();
  }

  deleteAccount(index) {
    const fromdata = new FormData();
    fromdata.append("paId", this.accounts[index].paId + "");
    this.hr.put(GlobalFinal.PLANT_DOMAIN + "/plant/account/delete", fromdata, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          this.accounts.splice(index, 1);
        }
      });
  }

  async modifyAccount(index) {
    //创建账户修改模态框
    const modal = await this.modalController.create({
      component: SetAccountComponent,
      componentProps: {
        account: JSON.stringify(this.accounts[index])
      }
    });
    return await modal.present();
  }

}
