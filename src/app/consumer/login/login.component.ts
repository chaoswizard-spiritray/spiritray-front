import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal, LoginDTO } from '../../dto-model/dto-model.component';
import { RetrieveComponent } from '../retrieve/retrieve.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private phone: string;
  private password: string;
  private code: string;
  is_createImg = true;
  backRegister = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private modalContrller: ModalController
  ) { }

  ngOnInit() {
    //获取上一级路由，如果是register就不返回
    this.activatedRoute.queryParams.subscribe(data => {
      if (data != null) {
        if (data.uri == "register") {
          this.backRegister = 1;
        }
      }
    });
  }

  // 获取验证码
  getCode(event) {
    this.http.get(GlobalFinal.DOMAIN + "/consumer/code", GlobalFinal.HEADER)
      .subscribe(
        (response: any) => {
          if (this.is_createImg) {
            event.target.innerText = "";
            event.target.appendChild(document.createElement("img"));
            this.is_createImg = false;
          }
          document.getElementsByTagName("img")[0].setAttribute("src", response.data);
        });
  }

  // 请求登录
  login() {
    this.http
      .get(GlobalFinal.DOMAIN + "/consumer/login/" + this.phone + "/" + this.password + "/" + this.code, GlobalFinal.HEADER)
      .subscribe(
        (data: any) => {
          GlobalALert.getAlert({ message: data.msg });
          if (data.stausCode == 200) {
            //如果登录成功，就将jwt进行缓存
            let loginDTo: LoginDTO = data.data;//这里还需不需要JSON解析？不需要，接收进来就是一个对象。JSON=Jｓｏｂｊｅｃｔ
            localStorage.setItem("jwt", JSON.stringify(loginDTo.jwt));
            localStorage.removeItem('storeId');
            //如果是从注册页跳转过来的就不返回，直接到首页
            if (this.backRegister == 1) {
              location.replace("/consumer/myspirit");
            } else {
              location.replace("/consumer/myspirit");
            }
          }
        });
  }

  // 创建一个模态框
  async retrievePass() {
    const modal = await this.modalContrller.create({
      component: RetrieveComponent,//模态框中展示的组件
      initialBreakpoint: 0.7,//片式模态框的高度
      breakpoints: [0.3, 0.5, 0.8]//模态框的卡点
    });
    return await modal.present();
  }

  //跳转注册
  toregister() {
    this.router.navigateByUrl('/consumer/register');
  }



}
