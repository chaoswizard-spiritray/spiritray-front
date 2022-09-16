import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
})
export class CodeInputComponent implements OnInit {
  @Input() inputNum: number = 4;
  @Input() msg: string = "";
  @Input() staffId: string = "";

  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private router: Router
  ) { }

  ngOnInit() { }

  onCodeChanged(code: string) {
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    //请求登录
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/plant/logon/" + this.staffId + "/" + code, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          localStorage.setItem('staffId', data.data.staffId);
          localStorage.setItem('staffJwt', data.data.jwt);
          //跳转平台首页
          this.navParams.data.modal.dismiss({ 'value': code });
          this.router.navigateByUrl("/plant/platform");
        } else {
          this.navParams.data.modal.dismiss({ 'value': code });
        }
      });

  }

}
