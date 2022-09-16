import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../../../../service/store-router-data.service';

@Component({
  selector: 'app-modify-nickname',
  templateUrl: './modify-nickname.component.html',
  styleUrls: ['./modify-nickname.component.scss'],
})
export class ModifyNicknameComponent implements OnInit {
  value: string;
  constructor(
    private ui: StoreRouterDataService,
    private hr: HttpClient,
    public popoverController: PopoverController
  ) { }

  ngOnInit() { }

  modifyNickName() {
    if (this.value == null) {
      GlobalALert.getAlert({ message: "昵称不能为空" });
      return;
    }
    let formdata = new FormData();
    formdata.append("nickname", this.value);
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/nickname", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.data != null) {
          this.ui.userInf.consumerNickname = this.value;
          this.popoverController.dismiss({ 'dismissed': true });
        }
      });
  }

}
