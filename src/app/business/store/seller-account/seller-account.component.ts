import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccountCategory, GlobalALert, GlobalFinal, SellerAccount } from '../../../dto-model/dto-model.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ModifyAccountComponent } from './modify-account/modify-account.component';

@Component({
  selector: 'app-seller-account',
  templateUrl: './seller-account.component.html',
  styleUrls: ['./seller-account.component.scss'],
})
export class SellerAccountComponent implements OnInit {
  //平台提供的支付方式
  accas: Array<AccountCategory>;
  //商家的账户信息
  accounts: Array<SellerAccount>;
  //当前加载支付类型下标
  nowAccountCategory = 0;
  constructor(
    private hr: HttpClient,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.queryAccountCateGory();
    //延迟等待类型先加载完成
    setTimeout(() => this.querySellerAccount(1), 400);;
  }

  //查询平台的支付方式
  queryAccountCateGory() {
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/account/category", GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.accas = data.data;
      });
  }

  //查询商家账户
  querySellerAccount(accaId) {
    //设置当前加载支付类型下标
    for (let i = 0; i < this.accas.length; i++) {
      if (accaId == this.accas[i].accaId) {
        this.nowAccountCategory = i;
      }
    }
    //请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/account/" + accaId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.accounts = data.data;
      });
  }

  //添加账户
  async addAccount() {
    const modal = await this.modalController.create({
      component: CreateAccountComponent,
      componentProps: {
        accaId: this.nowAccountCategory + 1
      }
    });
    return await modal.present();
  }

  //删除账户
  deleteAccount(i) {
    //获取账户id，然后调用删除账户接口
    let accountId = this.accounts[i].accountId;
    let formdata = new FormData();
    formdata.append("accountId", accountId + "");
    let option = {
      headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", 'jwt': localStorage.getItem("jwt"), 'storeId': localStorage.getItem("storeId") }),
      withCredentials: true,
      body: formdata
    }
    this.hr.delete(GlobalFinal.SELLER_DOMAIN + "/store/account", option)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          this.accounts.splice(i, 1);
        }
      });
  }

  //修改账户信息
  async modifyAccount(index) {
    //创建账户修改模态框
    const modal = await this.modalController.create({
      component: ModifyAccountComponent,
      componentProps: {
        account: JSON.stringify(this.accounts[index])
      }
    });
    return await modal.present();
  }

  //显示提示框
  showTip() {
    GlobalALert.getAlert({ message: "平台已禁用该支付方式" });
  }
}
