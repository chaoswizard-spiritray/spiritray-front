import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';
import { LocationService } from '../../../../service/location.service';
import { AddressMenuComponent } from './address-menu/address-menu.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  @Input() isEnabled = false;//是否启用返回地址信息

  isShow = false;//删除图标是否显示

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private locationService: LocationService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    //加载地址信息
    this.queryAddress();
  }

  //关闭信息并返回
  dismissAndReturnValue(index: number) {
    //返回信息并关闭模态框
    this.navParams.data.modal.dismiss(this.locationService.addresses[index]);
  }

  //切换删除图标显示
  toggleDelete() {
    if (this.isShow) {
      //获取所有删除
      let delList = document.getElementsByClassName("delete");
      for (let i = 0; i < delList.length; i++) {
        delList[i].setAttribute("hidden", 'true');
      }
      //获取所有信息,删除类名
      let infList: any = document.getElementsByClassName("inf");
      for (let i = 0; i < infList.length; i++) {
        infList[i].setAttribute("class", "inf noshow");
      }
      this.isShow = false;
    } else {
      //获取所有删除
      let delList = document.getElementsByClassName("delete");
      for (let i = 0; i < delList.length; i++) {
        delList[i].removeAttribute("hidden");
      }
      //获取所有信息,删除类名
      let infList: any = document.getElementsByClassName("inf");
      for (let i = 0; i < infList.length; i++) {
        infList[i].setAttribute("class", "inf");
      }
      this.isShow = true;
    }
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

  //添加地址
  addAddress() {
    this.getAddressMenuModal(-1);
  }

  //删除地址
  removeAddress(i) {
    let formdata = new FormData();
    formdata.append("addressId", this.locationService.addresses[i].addressId);
    let option = {
      headers: new HttpHeaders({ "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0", 'jwt': localStorage.getItem("jwt") }),
      withCredentials: true,
      body: formdata
    }
    this.hr.delete(GlobalFinal.DOMAIN + "/consumer/info/addresses", option)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 200) {
          this.locationService.addresses.splice(i, 1);
          this.locationService.addressFirstShow.splice(i, 1);
          this.locationService.addressLastShow.splice(i, 1);
        }
      });
  }

  //修改地址
  modifyAddress(i) {
    this.getAddressMenuModal(i);
  }

  //弹出地址菜单组件
  async getAddressMenuModal(index) {
    const modal = await this.modalController.create({
      component: AddressMenuComponent,
      componentProps: { "index": index },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    return await modal.present();
  }

  //判断数据是否存在
  isExist() {
    return GlobalFinal.IS_EXIST.includes(this.locationService.addressFirstShow[0]);
  }




}
