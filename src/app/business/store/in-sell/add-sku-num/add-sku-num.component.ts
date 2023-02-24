import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ToastService } from 'ng-zorro-antd-mobile';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-add-sku-num',
  templateUrl: './add-sku-num.component.html',
  styleUrls: ['./add-sku-num.component.scss'],
})
export class AddSkuNumComponent implements OnInit {
  @Input() skus;
  @Input() commodityId;
  skuList = new Array();

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private _toast: ToastService,
    public alertController: AlertController
  ) { }
  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.skuList = JSON.parse(this.skus);
  }

  //提交单个sku价格
  async add(index) {
    const alert = await this.alertController.create({
      header: '请输入补充数量',
      buttons: [
        {
          text: "提交",
          role: 'submit'
        },
        {
          text: "取消",
          role: 'cancel'
        }
      ],
      inputs: [
        {
          placeholder: '填写数量',
          type: 'number',
          min: 1,
          max: 100,
        }
      ]
    });
    await alert.present();
    const { data, role } = await alert.onDidDismiss();
    const addnum = parseInt(data.values[0]);
    if (role == "cancel" || GlobalFinal.IS_EXIST.includes(data.values[0])) {
      GlobalALert.getToast("取消补充");
      return;
    }
    if (parseInt(data.values[0]) < 0) {
      GlobalALert.getToast("不能补充负库存");
      return;
    }
    if (parseInt(data.values[0]) == 0) {
      GlobalALert.getToast("补充数量为0");
      return;
    }
    //加载框
    this.loadingToast();
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    formdata.append("skuValue", this.skuList[index].skuValue);
    formdata.append("num", data.values[0]);
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/sku/add", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      this._toast.hide();
      GlobalALert.getToast(data.msg);
      this.skuList[index].num = this.skuList[index].num + addnum;
    });
  }

  //显示加载框
  loadingToast() {
    const toast = this._toast.loading('Loading...', 0, () => {
    }, true);
  }

}
