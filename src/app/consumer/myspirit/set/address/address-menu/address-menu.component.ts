import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Address, GlobalALert, GlobalFinal } from '../../../../../dto-model/dto-model.component';
import { PositionComponent } from '../../../../../position/position.component';
import { LocationService } from '../../../../../service/location.service';
import { PositionService } from '../../../../../service/position.service';

@Component({
  selector: 'app-address-menu',
  templateUrl: './address-menu.component.html',
  styleUrls: ['./address-menu.component.scss']
})
export class AddressMenuComponent implements OnInit {
  @Input() index;
  addressPro: string = "";
  addressStr: string = "";//细节地址
  takeName: string = "";//收货人
  takePhone: number;//收货人电话
  isDefault = false;//是否默认收款
  addressShow: string;
  constructor(
    private modalController: ModalController,
    private positionService: PositionService,
    private locationService: LocationService,
    private hr: HttpClient
  ) { }

  ngOnInit() {
    if (this.index >= 0) {
      let address = this.locationService.addresses[this.index];
      this.addressPro = address.address.slice(0, address.address.lastIndexOf(" "));
      this.addressStr = this.locationService.addressLastShow[this.index];
      this.takeName = address.takeName;
      this.takePhone = address.takePhone;
      if (address.isDefault > 0) {
        this.isDefault = true;
      }
      this.addressShow = this.locationService.addressFirstShow[this.index];
    }
  }

  //关闭模态框
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //获取省、市、区信息
  async getLocation() {
    const modal = await this.modalController.create({
      component: PositionComponent,
      componentProps: { 'location': this.addressPro },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.addressPro = data.location;
      //解析数据
      const ob: Observable<any> = this.locationService.parse(this.addressPro);
      let nowShow: string = "";
      if (ob != null) {
        ob.subscribe(([data1, data2, data3]: Array<any>) => {
          //拼接字符串
          if (data1.data.value === data2.data.value) {
            nowShow = data1.data.value + " " + data3.data.value;
          } else {
            nowShow = data1.data.value + " " + data2.data.value + " " + data3.data.value;
          }
          this.addressShow = nowShow;
        });
      }
    }
  }

  //添加收货地址
  addAddress(event) {
    event.target.setAttribute("disabled", "true");
    //封装地址信息
    let temp = new Address(null, null, null, this.takeName, this.takePhone, 0);
    temp.address = this.addressPro + " " + this.addressStr;
    if (this.isDefault) {
      temp.isDefault = 1;
    }
    let formdata = new FormData();
    formdata.append("location", JSON.stringify(temp));
    //请求添加数据
    this.hr.post(GlobalFinal.DOMAIN + "/consumer/info/addresses", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          //更改数据
          this.queryAddress();
          //关闭模态框
          this.dismiss();
        }
      });
  }

  //修改收货地址
  modifyAddress(event) {
    event.target.setAttribute("disabled", "true");
    let temp = new Address(null, null, this.addressPro + " " + this.addressStr.trim(), this.takeName, this.takePhone, 0);
    if (this.isDefault) {
      temp.isDefault = 1;
    }
    temp.addressId = this.locationService.addresses[this.index].addressId;
    let formdata = new FormData();
    formdata.append("address", JSON.stringify(temp));
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/info/addresses", formdata, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          this.queryAddress();
          this.dismiss();
        }
      })
  }
  //查询地址信息
  queryAddress() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/info/addresses", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.locationService.addresses = data.data;
          //解析数据
          this.locationService.addressFirstShow = [""];
          this.locationService.addressLastShow = [""];
          let i = 0;
          this.locationService.addresses.forEach((el) => {
            let addressPro = el.address.slice(0, el.address.lastIndexOf(" "));
            let addressStr = el.address.slice(el.address.lastIndexOf(" "), el.address.length);
            const ob: Observable<any> = this.locationService.parse(addressPro);
            let nowShow: string = "";
            if (ob != null) {
              ob.subscribe(([data1, data2, data3]: Array<any>) => {
                //拼接字符串
                if (data1.data.value === data2.data.value) {
                  nowShow = data1.data.value + " " + data3.data.value;
                } else {
                  nowShow = data1.data.value + " " + data2.data.value + " " + data3.data.value;
                }
                this.locationService.addressFirstShow[i] = nowShow;
                this.locationService.addressLastShow[i] = addressStr;
                i++;
              });
            }
          });
        }
      });
  }

}
