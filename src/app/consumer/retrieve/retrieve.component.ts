import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalALert, GlobalFinal } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.component.html',
  styleUrls: ['./retrieve.component.scss'],
})
export class RetrieveComponent implements OnInit {
  phone: number;
  newPass: string;//新密码
  newPassT: string;//确认密码
  code: string;//邮箱验证码
  email = "";//邮箱地址

  constructor(
    private hr: HttpClient,
    private router: Router
  ) { }

  ngOnInit() { }

  //发送验证码
  getEmail() {
    if (this.phone == null) {
      GlobalALert.getAlert({ message: "电话为空" });
    } else {
      this.hr.get(GlobalFinal.DOMAIN + "/consumer/emailCode/" + this.phone, GlobalFinal.HEADER)
        .subscribe((data: any) => {
          GlobalALert.getAlert({ message: data.msg });
          if (data.stausCode == 200) {
            this.email = data.data;
          }
        });
    }
  }

  //提交申请
  modifyPass() {
    if (!this.phone || !this.newPass || !this.newPassT || !this.code || this.email == '') {
      GlobalALert.getAlert({ message: "请完整填写信息" });
    } else {
      if (this.newPass != this.newPassT) {
        GlobalALert.getAlert({ message: "两次密码不匹配" });
      } else {

        let formdata: FormData = new FormData();
        const obj = {
          "password": this.newPass + "",
          "phone": this.phone + "",
          "email": this.email + "",
          "code": this.code + ""
        }
        formdata.append("params", JSON.stringify(obj) + "");
        this.hr.post(GlobalFinal.DOMAIN + "/consumer/info/backpassword", formdata, GlobalFinal.HEADER)
          .subscribe((data: any) => {
            GlobalALert.getAlert({ message: data.msg });
          });

      }
    }
  }
}
