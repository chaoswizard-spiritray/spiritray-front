import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-attention',
  templateUrl: './attention.component.html',
  styleUrls: ['./attention.component.scss'],
})
export class AttentionComponent implements OnInit {

  attentions = new Array();
  storeInfos = new Array();
  isHiddenCheckBox = true;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.queryAttention();
  }

  //关闭模态框
  back() {
    this.modalController.dismiss();
  }

  //查询买家关注信息
  queryAttention() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/attention/consumer/all", GlobalFinal.JWTHEADER).subscribe((data: any) => {
      if (data.data != null && data.data.length > 0) {
        this.attentions = data.data;
        //循环请求店铺信息
        this.attentions.forEach(el => {
          this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + el.storeId, GlobalFinal.HEADER)
            .subscribe((data: any) => {
              this.storeInfos.push(data.data);
            });
        })
      }
    })
  }

  //取消关注
  async cancelAttention(i) {
    if (await GlobalALert.getSureAlert("确定取关" + this.storeInfos[i].storeName + "吗？") != "confirm") {
      return;
    }
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/attention/" + this.storeInfos[i].storeId, {}, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 300) {
          this.router.navigate(["/consumer/login"], {});
        } else {
          if (data.msg == "已取消")
            this.storeInfos.splice(i, 1);
          this.attentions.splice(i, 1);
        }
      });
  }

  //跳转店铺
  toBeforeStore(i) {
    //获取店铺电话
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/phone/" + this.storeInfos[i].storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.modalController.dismiss();
        this.router.navigate(["/before-store"], {
          queryParams: {
            'storeId': this.storeInfos[i].storeId,
            'type': 0,
            'storePhone': data.data
          }
        });
      });
  }

  //打开选择
  openCheckBox() {
    if (this.isHiddenCheckBox) {
      this.isHiddenCheckBox = false;
    } else {
      this.isHiddenCheckBox = true;
    }
  }


}
