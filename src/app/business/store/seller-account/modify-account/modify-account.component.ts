import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, SellerAccount } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-modify-account',
  templateUrl: './modify-account.component.html',
  styleUrls: ['./modify-account.component.scss'],
})
export class ModifyAccountComponent implements OnInit {

  @Input() account: string;
  accountObj: SellerAccount;
  isCollection = false;


  constructor(
    private modalController: ModalController,
    private hr: HttpClient
  ) { }

  ngOnInit() {
    this.accountObj = JSON.parse(this.account);
    if (this.accountObj.isCollections > 0) {
      this.isCollection = true;
    }
  }

  //取消模态框
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //提交修改信息
  modifyAccount() {
    let formdata = new FormData();
    if (this.isCollection) {
      this.accountObj.isCollections = 1;
    } else {
      this.accountObj.isCollections = 0;
    }
    formdata.append('account', JSON.stringify(this.accountObj));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/store/account", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          setTimeout(() => {
            location.replace("/business/store/account");
          }, 1000);
        }
      });
  }

}
