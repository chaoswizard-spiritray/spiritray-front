import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../../../../service/store-router-data.service';

@Component({
  selector: 'app-modify-sex',
  templateUrl: './modify-sex.component.html',
  styleUrls: ['./modify-sex.component.scss'],
})
export class ModifySexComponent implements OnInit {

  constructor(
    private ui: StoreRouterDataService,
    private hr: HttpClient,
    private popoverController: PopoverController,
    private toast: ToastController
  ) { }

  ngOnInit() { }

  //修改性别
  modifySex(sex: number) {
    if (this.ui.userInf.consumerSex != sex) {
      let formdata = new FormData();
      formdata.append("sex", sex + "");
      this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/sex", formdata, GlobalFinal.JWTHEADER)
        .subscribe((data: any) => {
          GlobalALert.getToast(data.msg);
          if (data.stausCode == 200) {
            this.ui.userInf.consumerSex = sex;
            this.popoverController.dismiss({ 'dismissed': true });
          }
        });
    }
  }

}
