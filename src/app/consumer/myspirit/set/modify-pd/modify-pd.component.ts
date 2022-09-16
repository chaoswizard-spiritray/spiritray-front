import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-modify-pd',
  templateUrl: './modify-pd.component.html',
  styleUrls: ['./modify-pd.component.scss'],
})
export class ModifyPdComponent implements OnInit {
  pd: string = null;
  pd2: string = null;

  constructor(
    private hr: HttpClient,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  submit(event) {
    //获取数据
    let el = document.getElementsByTagName("ion-input");
    this.pd = el[0].value + "";
    this.pd2 = el[1].value + "";
    event.target.setAttribute("disabled", 'true');
    if (GlobalFinal.IS_EXIST.includes(this.pd) || GlobalFinal.IS_EXIST.includes(this.pd2)) {
      GlobalALert.getToast("请将信息填写完整");
      event.target.removeAttribute("disabled");
    } else if (this.pd !== this.pd2) {
      GlobalALert.getToast("两次密码输入不一致");
      event.target.removeAttribute("disabled");
    } else {
      let formdata = new FormData();
      formdata.append("password", this.pd);
      this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/password", formdata, GlobalFinal.JWTHEADER)
        .subscribe((data: any) => {
          GlobalALert.getToast(data.msg);
          if (data.stausCode == 200) {
            this.popoverController.dismiss();
          }
          event.target.removeAttribute("disabled");
        });
    }
  }
}
