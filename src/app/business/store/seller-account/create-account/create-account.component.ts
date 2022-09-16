import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, SellerAccount } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {

  @Input() accaId;

  accountObj: SellerAccount = new SellerAccount(null, null, null, null, null, null);

  isCollection = false;

  constructor(
    private modalController: ModalController,
    private hr: HttpClient
  ) { }

  ngOnInit() { }

  //取消模态框
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //添加账户
  addAccount(event) {
    if (this.accountObj.accountName == null || this.accountObj.accountNo == null) {
      GlobalALert.getAlert({ message: "请将信息填写完整" });
      return;
    }
    let formdata = new FormData();
    if (this.isCollection) {
      this.accountObj.isCollections = 1;
    } else {
      this.accountObj.isCollections = 0;
    }
    this.accountObj.accaId = this.accaId;
    formdata.append('account', JSON.stringify(this.accountObj));
    let obj: Element = event.target;
    obj.setAttribute("disabled", "true");//禁用提交按钮
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/store/account", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          setTimeout(() => { location.reload() }, 1000);
        } else {
          obj.removeAttribute("disabled");
        }
      });
  }

}
