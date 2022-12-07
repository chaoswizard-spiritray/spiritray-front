import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Consumer, GlobalALert, GlobalFinal, RegisterDTO } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  phone: string = null;

  password: string = null;

  dpassword: string = null;

  email: string = null;

  nickname: string = null;
  sex = 0;
  code: string = null;
  is_createImg = true;
  isShow = false;

  constructor(private http: HttpClient, public alterM: AlertController, private router: Router) {
  }

  ngOnInit() { }


  // 设置选中的性别的值
  setSex(value) {
    this.sex = value;
  }

  // 获取验证码
  getCode(event) {
    this.http
      .get(GlobalFinal.DOMAIN + "/consumer/code", GlobalFinal.HEADER)
      .subscribe((data: any) => {
        //   if (this.is_createImg) {
        //     event.target.innerText = "";
        //     event.target.appendChild(document.createElement("img").setAttribute("class", "registerImg"));
        //     this.is_createImg = false;
        //   }
        //   document.getElementsByClassName("registerImg")[0].setAttribute("src", response.data);
        // });
        this.isShow = true;
        document.getElementsByClassName("registerImg")[0].setAttribute("src", data.data);
      });
  }

  /** ---------注册------------------------------------------------*/
  register() {
    //先验证
    if (this.dpassword !== this.password) {
      GlobalALert.getAlert({ message: "两次密码不一致" });
      return;
    }
    if (this.phone == null || this.password == null || this.nickname == null || this.dpassword == null) {
      GlobalALert.getAlert({ message: "请将信息填写完整" });
      return;
    }
    // 封装对象
    let consumer = new Consumer(null, this.nickname, Number.parseInt(this.phone), this.password, this.email, this.sex);
    let registerDTO = new RegisterDTO(consumer, this.code);
    // 发送请求
    this.http
      .post(
        GlobalFinal.DOMAIN + "/consumer/register",
        JSON.stringify(registerDTO),
        GlobalFinal.HEADER)
      .subscribe(
        (data: any) => {
          //获取到请求回来的信息
          GlobalALert.getAlert({ message: data.msg });
          if (data.stausCode == 200) {
            //如果注册成功，就跳转登录页面
            this.router.navigateByUrl("/consumer/login?uri=register");
          }
        }
      );
  }

  //跳转登录
  tologin() {
    this.router.navigateByUrl('/consumer/login');
  }

}
