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
  email = null;//邮箱地址
  newPass = null;//新密码
  newPassT = null;//确认密码
  code = null;//邮箱验证码

  constructor(
    private hr: HttpClient,
    private router: Router
  ) { }

  ngOnInit() { }

  //发送验证码
  getEmail() {
    if (this.email == null) {
      GlobalALert.getAlert({ message: "邮箱为空" });
    } else {
      this.hr.get(GlobalFinal.DOMAIN + "/consumer/emailCode/" + this.email, GlobalFinal.HEADER)
        .subscribe((data: any) => {
          GlobalALert.getAlert({ message: data.msg });
        });
    }
  }

  //提交申请
  modifyPass() {
    if (this.email == null || this.newPass == null || this.newPassT || this.code == null) {
      GlobalALert.getAlert({ message: "请完整填写信息" });
    } else {
      if (this.newPass == null != this.newPassT) {
        GlobalALert.getAlert({ message: "两次密码不匹配" });
      } else {
        let formData = new FormData();
        formData.append("consumerPassword", this.newPass);
        formData.append("email", this.email);
        formData.append("code", this.code);
        this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/backPassword", formData, GlobalFinal.JWTHEADER)
          .subscribe((data: any) => {
            GlobalALert.getAlert({ message: data.msg });
          });

      }
    }
  }
}
