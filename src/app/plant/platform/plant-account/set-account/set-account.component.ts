import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, PlantAccount } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-set-account',
  templateUrl: './set-account.component.html',
  styleUrls: ['./set-account.component.scss'],
})
export class SetAccountComponent implements OnInit {
  @Input() account: string;
  accountObj: PlantAccount;
  isCollection = false;


  constructor(
    private modalController: ModalController,
    private hr: HttpClient
  ) { }

  ngOnInit() {
    this.accountObj = JSON.parse(this.account);
    if (this.accountObj.isUseable > 0) {
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
      this.accountObj.isUseable = 1;
    } else {
      this.accountObj.isUseable = 0;
    }
    formdata.append('account', JSON.stringify(this.accountObj));
    this.hr.put(GlobalFinal.PLANT_DOMAIN + "/plant/account/modify", formdata, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          setTimeout(() => {
            location.replace("/plant/platform/account");
          }, 1000);
        }
      });
  }

}
