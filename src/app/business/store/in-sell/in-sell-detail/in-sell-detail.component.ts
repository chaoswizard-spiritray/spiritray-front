import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { GlobalALert, GlobalFinal, InCheckDetail, Sku, SSMap } from '../../../../dto-model/dto-model.component';
import { AddSkuNumComponent } from '../add-sku-num/add-sku-num.component';
import { CommodityDetailComponent } from '../commodity-detail/commodity-detail.component';
import { ModifySkuPriceComponent } from '../modify-sku-price/modify-sku-price.component';

@Component({
  selector: 'app-in-sell-detail',
  templateUrl: './in-sell-detail.component.html',
  styleUrls: ['./in-sell-detail.component.scss'],
})
export class InSellDetailComponent implements OnInit {

  @Input() commodityId: string;

  inCheckDetail: InCheckDetail;

  skus: Array<Sku>;

  simpleCavs: Array<SSMap>;

  mulCavs: Array<SSMap>;

  constructor(
    private navParams: NavParams,
    private hr: HttpClient,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.queryCheckInf();
  }

  //补充库存
  async addNum() {
    const modal = await this.modalController.create({
      component: AddSkuNumComponent,//模态框中展示的组件
      componentProps: {
        'skus': JSON.stringify(this.skus),
        'commodityId': this.commodityId
      },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  //调整价格
  async modifyPrice() {
    const modal = await this.modalController.create({
      component: ModifySkuPriceComponent,//模态框中展示的组件
      componentProps: {
        'skus': JSON.stringify(this.skus),
        'commodityId': this.commodityId
      },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  //打开详情管理模态框
  async openCommodityDetailModal() {
    const modal = await this.modalController.create({
      component: CommodityDetailComponent,//模态框中展示的组件
      componentProps: {
        'commodityId': this.commodityId
      },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
  }

  //切换sku显示
  toggleSku() {
    const sku = document.getElementsByClassName('sku')[0];
    if (!(sku.getAttribute("hidden") === null)) {
      //打开
      sku.removeAttribute("hidden");
      //加载数据
      this.querySku();
    } else {
      //关闭
      sku.setAttribute("hidden", 'true');
    }
  }

  //切换attribute显示
  toggleCav() {
    const cav = document.getElementsByClassName('cav')[0];
    if (!(cav.getAttribute("hidden") === null)) {
      //打开
      cav.removeAttribute("hidden");
      //加载数据
      this.querySimpleAttribute();
      this.queryMulAttribute();
    } else {
      //关闭
      cav.setAttribute("hidden", 'true');
    }
  }

  //加载sku
  querySku() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/sku/all/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.skus = data.data;
      });
  }

  //加载参数信息
  querySimpleAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/simple/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.simpleCavs = data.data;
      });
  }

  queryMulAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/cav/mul/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        //注意编译后的指令重排序,完全无法理解这个ＴＳ编译器
        const cavs: Array<SSMap> = data.data;
        let i = 0;
        let flag = false;
        cavs.forEach((cav1) => {
          if (!this.mulCavs) {
            this.mulCavs = new Array();
            this.mulCavs.push(cav1);
          } else {
            this.mulCavs.forEach((cav2) => {
              if (cav1.attributeName == cav2.attributeName) {
                this.mulCavs[i].attributeValue = cav2.attributeValue + "," + cav1.attributeValue;
                flag = true;
              }
              i++;
            });
            if (!flag) {
              this.mulCavs.push(cav1);
            } else {
              flag = false;
            }
            i = 0;
          }
        });
      });
  }

  //查询审核详细信息
  queryCheckInf() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/incheck/detail/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        this.inCheckDetail = data.data;
      });
  }

  //关闭模态框
  dismiss() {
    this.modalController.dismiss();
  }

  //下架商品
  async downCommodity() {
    if (await GlobalALert.getSureAlert("下架后将不可再恢复,确定要下架商品吗") != "confirm") {
      return;
    }
    const alert = await this.alertController.create({
      header: '请输入下架备注',
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
          placeholder: '备注',
          min: 1,
          max: 100,
        }
      ]
    });
    await alert.present();
    const { data } = await alert.onDidDismiss();
    console.log(data.values[0]);
    const formdata = new FormData();
    formdata.append("commodityId", this.commodityId);
    formdata.append("des", data.values[0]);
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/commodity/seller/down", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      GlobalALert.getAlert({ message: data.msg });
      if (data.stausCode == 200) {
        this.modalController.dismiss();
      }
    });
  }


}
