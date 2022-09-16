import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Attribute, Category, Cav, GlobalALert, GlobalFinal, Sku } from '../../../dto-model/dto-model.component';
import { PositionComponent } from '../../../position/position.component';
import { LocationService } from '../../../service/location.service';
import { PutDataComponent } from './put-data/put-data.component';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  //商品基础信息
  commodityName: string = "";
  commodityDescribe: string = "";
  address: string = "";
  shipping: number;
  addressPro: string;
  addressShow: string;
  addressStr: string;
  nowCategoryId: number;//最终选中的种类
  //商品类别信息
  categorys: Array<Array<Category>> = new Array();
  //商品属性信息
  attributes: Array<Array<Attribute>> = new Array();
  //商品属性值信息
  cavs: Array<Cav> = new Array();
  //商品组合属性值
  mulValues: Map<string, Array<string>> = new Map();
  //商品sku值
  skus: Array<string> = new Array();
  //附图
  salveMaps: Array<File> = new Array();
  //主图
  masterMapFile: File;
  //初始各级种类颜色对应class
  cateColor: Array<string> = new Array(...["cate1", "cate2", "cate3", "cate4", "cate5"]);
  //每一级上次选中的元素引用
  cateRefer: Array<any> = new Array();
  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private locationService: LocationService,
    private popoverController: PopoverController,
    private router: Router) { }

  ngOnInit() {
    //查询初级类别
    this.queryCategory(0, 0);
    setTimeout(() => { }, 2000);
  }

  //获取指定属性名的值数组
  getMulValue(attributeName: string) {
    return this.mulValues.get(attributeName);
  }

  //添加指定多元属性值
  addMulValue(event, attributeName) {
    let obj = event.target.previousElementSibling;
    if (this.mulValues.get(attributeName) == undefined) {
      this.mulValues.set(attributeName, new Array<string>());
    }
    this.mulValues.get(attributeName).push(obj.value);
    obj.value = "";
  }

  //删除指定属性的值
  deleteMulValue(event, attributeName) {
    let values = this.mulValues.get(attributeName);
    let i = values.indexOf(event.target.innerText, 0);
    if (i != -1) {
      values.splice(i, 1);
    };
  }

  //生成sku
  generateSkus() {
    let temp = new Array<string>();
    let len = 0;
    this.mulValues.forEach((value, key) => {
      len++;
      if (temp.length == 0) {
        value.forEach((s) => {
          if (len == this.mulValues.size) {
            temp.push(s)
          } else {
            temp.push(s + "+");
          }
        });
      } else {
        let i = temp.length;
        temp.forEach((v) => {
          value.forEach((s) => {
            if (len == this.mulValues.size) {
              temp.push(v + s)
            } else {
              temp.push(v + s + "+");
            }
          })
        });
        temp.splice(0, i);
      }
    });
    //赋值
    this.skus = temp;
  }

  //判断值是1还是0
  isOne(num) {
    if (num == 0) {
      return false;
    } else {
      return true;
    }
  }

  //判断值是1还是0
  isZero(num) {
    if (num == 1) {
      return false;
    } else {
      return true;
    }
  }

  //图片展示
  showImg(event) {
    let element = event.target;
    let content = document.getElementsByClassName("childContent")[0];
    let footer = document.getElementsByClassName("childFooter")[0];
    //隐藏内容，显示图片
    content.setAttribute("hidden", "true");
    footer.setAttribute("hidden", "true");
    let see = document.getElementsByClassName("see")[0];
    see.removeAttribute("hidden");
    let child: any = see.lastChild;
    child.setAttribute("src", element.getAttribute("src"));
  }

  //取消展示
  noShowImg(event) {
    event.target.parentNode.setAttribute("hidden", "true");
    let content = document.getElementsByClassName("childContent")[0];
    let footer = document.getElementsByClassName("childFooter")[0];
    content.removeAttribute("hidden");
    footer.removeAttribute("hidden");
  }

  //查询指定id以及级别的类别
  queryCategory(categoryId: Number, index: number) {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/category/" + categoryId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          //如果有数据，就将类别信息放在指定级别上
          this.categorys[index] = data.data;
        }
      })
      ;
  }

  //查询属性信息
  queryAttribute(categoryId: Number, index: number) {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/attribute/" + categoryId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          //如果有数据，就替换指定类别信息
          this.attributes[index] = data.data;
        }
      })
      ;
  }

  //上传主图
  addMasterMap(event) {
    let el = event.target;
    //保存图片
    this.masterMapFile = el.files[0];
    //展示图片
    el.parentNode.lastChild.lastChild.setAttribute("src", URL.createObjectURL(this.masterMapFile));
  }

  //将附图值添加到值中
  addSalveMap(event, i) {
    //替换文件
    let file = event.target.files[0];
    if (i > (this.salveMaps.length - 1)) {
      this.salveMaps.push(file);
    } else {
      this.salveMaps[i] = file;
    }
    //展示图片
    let url = URL.createObjectURL(file);
    event.target.parentNode.lastChild.lastChild.setAttribute("src", url);
  }

  //切换商品的类型
  categoryToggle(event, father, categoryId, index) {
    //清空子级种类
    this.categorys.splice(index + 1, this.categorys.length - 1 - index);
    //清空当前级以及子级属性
    this.attributes.splice(index, this.attributes.length - index);
    //请求子级种类
    this.queryCategory(categoryId, index + 1);
    //请求当前级属性
    this.queryAttribute(categoryId, index);
    //设置当前商品所属种类
    this.nowCategoryId = categoryId;
    //异步更新节点颜色
    const promise = new Promise(() => {
      //切换节点以及颜色
      if (this.cateRefer[index] != null) {
        //删除默认类名
        let str: string = this.cateRefer[index].getAttribute('class');
        str = str.replace(" cateDefalut", "");
        this.cateRefer[index].removeAttribute('class');
        this.cateRefer[index].setAttribute('class', str);
      }
      //保存当前选中的级别节点并且添加默认选中颜色类名
      this.cateRefer[index] = event.target;
      this.cateRefer[index].setAttribute('class', this.cateRefer[index].getAttribute('class') + ' cateDefalut');
    });
  }

  //提交数据
  submit(event) {
    try {
      event.target.setAttribute("disabled", 'true');
      //创建表单
      let formdata: FormData = new FormData();
      //添加主图
      formdata.append("masterMapFile", this.masterMapFile, this.masterMapFile.name);
      //添加附图
      this.salveMaps.forEach(f => {
        formdata.append("salveMapFiles", f, f.name);
      });
      //添加商品基本信息
      formdata.append("commodityName", this.commodityName);
      formdata.append("commodityDescribe", this.commodityDescribe);
      formdata.append("address", this.addressPro + " " + this.addressStr);
      formdata.append("categoryId", this.nowCategoryId + "");
      formdata.append("shipping", this.shipping + "");
      //保存属性数组
      this.attributes.forEach((arr) => {
        arr.forEach((at) => {
          //如果是商品标准单元属性，就直接添加
          if (at.isMul == 0) {
            let obj: any = document.getElementsByClassName(at.attributeName)[0];
            let cav = new Cav("", at.attributeId, "", obj.value);
            this.cavs.push(cav);
          } else {
            //如果是多值属性，就需要遍历它的值数组
            let values = this.mulValues.get(at.attributeName);
            if (values !== undefined) {
              values.forEach((v) => {
                let cav = new Cav("", at.attributeId, "", v);
                this.cavs.push(cav);
              });
            }
          }
        });
      });
      formdata.append("cavs", JSON.stringify(this.cavs));
      //保存sku
      let tempSkus = new Array<Sku>();
      let prices: any = document.getElementsByClassName("price");
      let nums: any = document.getElementsByClassName("num");
      let i = 0;
      this.skus.forEach((sku) => {
        let tempSku = new Sku("", sku, "", prices[i].value, nums[i].value);
        i++;
        tempSkus.push(tempSku);
      });
      formdata.append("skus", JSON.stringify(tempSkus));
      //调用商品发布接口
      this.hr.post(GlobalFinal.SELLER_DOMAIN + "/commodity/publish", formdata, GlobalFinal.STORE_HEADER)
        .subscribe((data: any) => {
          GlobalALert.getAlert({ message: data.msg });
          if (data.stausCode == 200) {
            event.target.removeAttribute("disabled");
            this.modalController.dismiss();
          }
        });
    } catch (error) {
      console.log(error);
      event.target.removeAttribute("disabled");
    }
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

  //填充默认价格和数量
  async putData() {
    const popover = await this.popoverController.create({
      component: PutDataComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      arrow: true
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    //数据填充
    let price: any = document.getElementsByClassName("price");
    let num: any = document.getElementsByClassName('num');
    for (let i = 0; i < price.length; i++) {
      price[i].value = data.price;
      num[i].value = data.num;
    }
  }
}
