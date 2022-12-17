import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { GlobalFinal, SNMap } from '../dto-model/dto-model.component';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss'],
})
export class ConditionComponent implements OnInit {

  @Input() type = 0;//需要展示什么类型的筛选条件
  @Input() childType = 0;//具体类型下的子类型，如店铺订单下的未付款，已付款
  @Input() word = "";//关键词

  /**
   * 商家端相关数据
   */
  //订单价格区间
  orderTotalMoney: Array<number>;
  //收货地址集合
  addresses: Array<string>;
  //收货地址解析集合
  addressShow: Array<string>;
  //收货电话集合
  takePhones: Array<number>;
  //物流单号集合
  logisticsNos: Array<string>;
  //选取的下单时间
  checkStartTime = '0';
  //选取的总价下标
  checkTotalMoneyIndex = '-1';
  //选取的收货地址
  checkAddress: string = "";
  //选取的收货电话
  checkTakePhone = '0';
  //选取的物流单号
  checkLogisticsNo: string = "";
  //选取的完单时间
  checkEndTime = '0';
  //选取的评价条件
  checkComment = '-1';

  /**
   * 买家端商品筛选条件
   */
  //上架时间
  checkDate = '0';
  checkPriceIndex = '-1';
  checkShipAddress = "";
  checkCateId = '-1';
  checkBrand = "";
  //商品价格区间
  commodityPrice: Array<number>;
  //发货地址集合
  shipAddresses: Array<string>;
  //发货地址解析集合
  shipAddressShow: Array<string>;
  //商品种类
  commodityCates: Array<SNMap>;
  //商品品牌
  commodityBrands: Array<string>;


  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  /**
   *初始化数据 
   */
  ngOnInit() {
    switch (this.type) {
      case 0: this.queryStoreCondition(); break;
      case 1: this.queryConsumerCommodityCodition(); break;
    }
  }

  /**
   * 解析参数
   */
  parseAddress() {
    this.addressShow = new Array();
    if (this.addresses != undefined) {
      this.addresses.forEach((location) => {
        let result = "";
        if (GlobalFinal.IS_EXIST.includes(location) || location.length <= 0) {
          return "";
        }
        let array: Array<number>;
        try {
          array = JSON.parse(location);
        } catch {
          location = location.slice(0, location.indexOf(" "));
          array = JSON.parse(location);
        }
        //创建一个可观察对象数组
        const arr = [
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER),
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER),
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
        ];
        forkJoin(arr).subscribe(([data1, data2, data3]: Array<any>) => {
          //拼接字符串
          if (data1.data.value === data2.data.value) {
            result = data1.data.value + " " + data3.data.value;
          } else {
            result = data1.data.value + " " + data2.data.value + " " + data3.data.value;
          }
          this.addressShow.push(result);
        });
      });
    }
  }
  /**
   * 加载商家端订单筛选数据集合
   */
  queryStoreCondition() {
    this.hr.get(GlobalFinal.ORDER_DOMAIN + "/order/store/data/" + this.childType, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          if (!GlobalFinal.IS_EXIST.includes(data.data)) {
            this.orderTotalMoney = data.data.orderTotalMoney;
            this.addresses = data.data.addresses;
            this.takePhones = data.data.takePhones;
            this.logisticsNos = data.data.logisticsNos;
            //解析参数
            this.parseAddress();
          }
        }
      });
  }

  /**
   * 加载买家搜索商品筛选条件
   */
  queryConsumerCommodityCodition() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/search/data/fliter/" + this.word, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.commodityPrice = data.data.commodityPrice;
        this.commodityCates = data.data.commodityCates;
        this.commodityBrands = data.data.commodityBrands;
        this.shipAddresses = data.data.shipAddresses;
        this.paseShipAddress();
      });
  }

  /**
   * 解析发货地址
   */
  paseShipAddress() {
    this.shipAddressShow = new Array();
    if (this.shipAddresses != undefined) {
      this.shipAddresses.forEach(async (location) => {
        let result = "";
        if (GlobalFinal.IS_EXIST.includes(location) || location.length <= 0) {
          return "";
        }
        let array: Array<number>;
        try {
          array = JSON.parse(location);
        } catch {
          location = location.slice(0, location.indexOf(" "));
          array = JSON.parse(location);
        }
        //创建一个可观察对象数组
        const arr = [
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/province/simple/" + array[0], GlobalFinal.HEADER),
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/city/simple/" + array[1], GlobalFinal.HEADER),
          this.hr.get(GlobalFinal.PLANT_DOMAIN + "/location/district/simple/" + array[2], GlobalFinal.HEADER)
        ];
        await forkJoin(arr).subscribe(([data1, data2, data3]: Array<any>) => {
          //拼接字符串
          if (data1.data.value === data2.data.value) {
            result = data1.data.value + " " + data3.data.value;
          } else {
            result = data1.data.value + " " + data2.data.value + " " + data3.data.value;
          }
          this.shipAddressShow.push(result);
        });
      });
    }
  }

  /**
   *清除商家端订单选取的值 
   */
  clearStoreOrderCheck() {
    switch (this.type) {
      case 0: {
        //选取的下单时间
        this.checkStartTime = '0';
        //选取的总价下标
        this.checkTotalMoneyIndex = '-1';
        //选取的收货地址
        this.checkAddress = "";
        //选取的收货电话
        this.checkTakePhone = '0';
        //选取的物流单号
        this.checkLogisticsNo = "";
        //选取的完单时间
        this.checkEndTime = '0';
        //选取的评价条件
        this.checkComment = '-1';
      }; break;
      case 1: {
        this.checkDate = '0';
        this.checkPriceIndex = '-1';
        this.checkShipAddress = "";
        this.checkCateId = '-1';
        this.checkBrand = "";
      }; break;
    }
  }

  /**
   * 关闭模态框
   * @param isReturnData 是否需要返回数据
   */
  dismiss(isReturnData) {
    if (isReturnData == -1) {
      this.modalController.dismiss();
    }
    //封装商家端订单选取的数据
    const data = new Array();
    switch (this.type) {
      case 0: {
        //下单时间
        if (this.checkStartTime != '0') {
          data.push({ "startTime": parseInt(this.checkStartTime) });
        }
        //总计费用范围
        if (this.checkTotalMoneyIndex != '-1') {
          //添加订单费用上下界
          data.push({ "totalMoneyCeil": this.orderTotalMoney[parseInt(this.checkTotalMoneyIndex)] });
          if (this.checkTotalMoneyIndex == '0') {
            data.push({ "totalMoneyFloor": 0 });
          } else {
            data.push({ "totalMoneyFloor": this.orderTotalMoney[parseInt(this.checkTotalMoneyIndex) - 1] });
          }
        }
        //收货地址
        if (!GlobalFinal.IS_EXIST.includes(this.checkAddress)) {
          data.push({ "address": this.checkAddress });
        }
        //收货电话
        if (!GlobalFinal.IS_EXIST.includes(this.checkTakePhone) && this.checkTakePhone != '0') {
          data.push({ "takePhone": this.checkTakePhone });
        }
        //物流单号
        if (!GlobalFinal.IS_EXIST.includes(this.checkLogisticsNo)) {
          data.push({ "logistics": this.checkTakePhone });
        }
        //完单时间
        if (this.checkEndTime != '0') {
          data.push({ "endTime": parseInt(this.checkEndTime + "") });
        }
        //是否已经评论
        if (this.checkComment != '-1') {
          data.push({ "isComment": this.checkComment });
        }
      }; break;
      case 1: {
        //上架时间
        if (this.checkDate != '0') {
          data.push({ "checkDate": parseInt(this.checkDate + "") });
        }
        //总计费用范围
        if (this.checkPriceIndex != '-1') {
          //添加订单费用上下界
          data.push({ "priceCeil": this.commodityPrice[parseInt(this.checkPriceIndex)] });
          if (this.checkPriceIndex == '0') {
            data.push({ "priceFloor": 0 });
          } else {
            data.push({ "priceFloor": this.commodityPrice[parseInt(this.checkPriceIndex) - 1] });
          }
        }
        //发货地址
        if (this.checkShipAddress != "" && this.checkShipAddress != 'undefined') {
          data.push({ "shipAddress": this.checkShipAddress });
        }
        //选取的种类
        if (this.checkCateId + "" != '-1' && this.checkCateId + "" != 'undefined') {
          data.push({ "cate": parseInt(this.checkCateId) });
        }
        //选取的品牌
        if (this.checkBrand != '-1' && this.checkBrand != '') {
          data.push({ "brand": this.checkBrand });
        }
      }; break;
    }
    //关闭并返回数据
    this.navParams.data.modal.dismiss(data);
  }

}
