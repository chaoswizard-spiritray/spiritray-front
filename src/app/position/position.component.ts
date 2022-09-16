import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GlobalFinal, NSMap } from '../dto-model/dto-model.component';
import { LocationService } from '../service/location.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit {
  province: NSMap;
  city: NSMap;
  district: NSMap;
  show1 = false;//是否改变竖线1颜色
  show2 = false;//是否改变竖线2颜色
  @Input() location: string;//地址信息数组

  //省
  proList: Array<NSMap>;
  //市
  cityList: Array<NSMap>;
  //区
  disList: Array<NSMap>;

  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
    private hr: HttpClient,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    if (!GlobalFinal.IS_EXIST.includes(this.location) && this.location.length > 0) {
      let array: Array<number> = JSON.parse(this.location);
      //查询省
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER)
        .subscribe((data: any) => {
          this.province = data.data;
        });
      //查询市
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER)
        .subscribe((data: any) => {
          this.city = data.data;
        });
      //查询区
      this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
        .subscribe((data: any) => {
          this.district = data.data;
        });
      this.show1 = true;
      this.show2 = true;
    } else {
      this.queryProvince();
    }
  }

  //加载省级地址信息
  queryProvince() {
    //清空数据
    this.city = null;
    this.district = null;
    this.cityList = null;
    this.disList = null;
    this.show1 = false;
    this.show2 = false;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province", GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.proList = data.data;
      });
  }

  //通过指定省会查询其市信息
  queryCity(provinceId: number) {
    if (provinceId == null || provinceId < 0) {
      return;
    }
    //清空数据
    this.district = null;
    this.proList = null;
    this.disList = null;
    this.show2 = false;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/" + provinceId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.cityList = data.data;
      });
  }

  //通过市查询区级信息
  queryDistrict(cityId: number) {
    if (cityId == null || cityId < 0) {
      return;
    }
    //清空数据
    this.proList = null;
    this.cityList = null;
    this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/" + cityId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.disList = data.data;
      });
  }

  //选取省值
  selectProValue(index: number) {
    this.province = this.proList[index];
    //查询市值
    this.queryCity(this.province.key);
  }

  //选取市值
  selectCityValue(index: number) {
    this.city = this.cityList[index];
    //查询区值
    this.queryDistrict(this.city.key);
  }

  //选取区值
  selectDisValue(index: number) {
    this.district = this.disList[index];
    this.dismiss();
  }

  //关闭模态框
  dismiss() {
    if (this.province == null || this.city == null || this.district == null) {
      //关闭模态框
      this.modalController.dismiss({
        'dismissed': true
      });
    }
    //拼接当前地址编号路径
    let str = new Array<number>();
    if (this.province != null) {
      str.push(this.province.key);
    }
    if (this.city != null) {
      str.push(this.city.key);
    }
    if (this.district != null) {
      str.push(this.district.key);
    }
    //保存信息
    let loca = JSON.stringify(str);
    this.navParams.data.modal.dismiss({ 'location': loca });
    //关闭模态框
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
