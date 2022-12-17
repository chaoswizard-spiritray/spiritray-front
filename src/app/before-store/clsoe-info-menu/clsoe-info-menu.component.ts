import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert } from '../../dto-model/dto-model.component';


// 查封信息填写表单
@Component({
  selector: 'app-clsoe-info-menu',
  templateUrl: './clsoe-info-menu.component.html',
  styleUrls: ['./clsoe-info-menu.component.scss'],
})
export class ClsoeInfoMenuComponent implements OnInit {
  @Input() role = 0;//0表示平台1表示商家
  @Input() type = 0;//表单类型：0表示查封表单、1表示解封表单
  @Input() storeHead;//店铺信息
  @Input() storeName;
  //查封数据
  sealCause = "";//查封原因
  closeDay;//封店时长
  closeForever = false;//封闭永久
  //解封数据
  overInfo = "";//解封原因

  //样式
  namestyle = "";

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() { }


  ionViewWillEnter() {
    this.namestyle = "color: rgb(152, 84, 0);font-size: 20px;margin-top: 10px;margin-bottom: 10px;margin-left:" + ((393 - this.storeName.length * 20) / 2) + "px";
  }

  //关闭菜单
  dismiss(isReturn) {
    if (isReturn == -1) {
      this.modalController.dismiss();
    } else {
      const data = this.packData();
      if (data != null) {
        this.modalController.dismiss(data);
      }
    }
  }

  //封装数据
  packData() {
    switch (this.type) {
      case 0: {
        if (this.sealCause.trim() == "" || (this.closeDay <= 0 && !this.closeForever)) {
          GlobalALert.getToast("信息不合法");
          return null;
        } else {
          const data = new Array();
          data.push({ "closeCause": this.sealCause });
          if (this.closeForever) {
            data.push({ "closeDay": -1 });
          } else {
            data.push({ "closeDay": this.closeDay });
          }
          return data;
        }
      }; break;
      case 1: {

      }; break;
    }
  }
}