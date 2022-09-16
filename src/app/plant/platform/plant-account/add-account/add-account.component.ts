import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, PlantAccount } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit {

  @Input() accaId;

  accountObj: PlantAccount = new PlantAccount(null, null, null, null, null, null);

  isUseable = false;

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
    const fromdata = new FormData();
    this.accountObj.accaId = this.accaId;
    if (this.isUseable) {
      this.accountObj.isUseable = 1;
    } else {
      this.accountObj.isUseable = 0;
    }
    fromdata.append("account", JSON.stringify(this.accountObj));
    this.hr.post(GlobalFinal.PLANT_DOMAIN + "/plant/account/add", fromdata, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          setTimeout(() => { location.reload() }, 1000);
        }
      });
  }
}
