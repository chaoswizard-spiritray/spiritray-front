import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';
import { ImgShowComponent } from '../../../img-show/img-show.component';
import { StoreRouterDataService } from '../../../service/store-router-data.service';

@Component({
  selector: 'app-store-inf',
  templateUrl: './store-inf.component.html',
  styleUrls: ['./store-inf.component.scss'],
})
export class StoreInfComponent implements OnInit {

  licenses: Array<String>;

  state: string = "";

  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private srd: StoreRouterDataService
  ) { }

  ngOnInit() {
    this.queryStore();
    //监听文件上传
    let input = document.getElementById("head");
    //调用upload
    input.addEventListener("change", () => { this.modifyStoreHead(input) });
  }

  queryStore() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + localStorage.getItem("storeId"), GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        //因为data本身就被转换为了一个Object，你通过．获取到的就是他的属性，这个就是一个对象，不用手动解析。就是说我们前端接收时完全不用转换
        this.srd.storeInf = data.data;
        //判断当前店铺状态
        if (this.srd.storeInf.status == 1) {
          this.state = "营业中";
        } else {
          this.state = "封闭中";
        }
      });
  }

  //修改店铺名称
  modifyStoreName() {
    let el = document.getElementsByTagName("ion-input")[0];
    let data = new FormData();
    let value = el.value;
    data.append("storeName", "" + value);
    data.append("storeId", localStorage.getItem("storeId"));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/store/storeInf", data, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          el.value = "";
          this.srd.storeInf.storeName = value + "";
        }
      });
  }

  //修改店铺头像
  modifyStoreHead(obj) {
    let file = obj.files[0];
    let formdata = new FormData();
    formdata.append("file", file, file.name);
    formdata.append("storeId", localStorage.getItem("storeId"));
    this.hr.put(GlobalFinal.SELLER_DOMAIN + "/store/storeInf", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          this.queryStore();
        }
      });
  }

  //显示图片全屏
  async showAll(license) {
    const modal = await this.modalController.create({
      component: ImgShowComponent,//模态框中展示的组件
      componentProps: {
        "url": license
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  //跳转关闭页面
  skipClose() {
    if (this.srd.storeInf.status == 0) {
      this.router.navigateByUrl("/business/store/closed");
      setTimeout(() => {
        this.router.navigateByUrl("/business/store/closed");
      }, 100);
    }
  }

  // 跳转指定页面
  skip(url: string) {
    this.router.navigateByUrl(url);
  }

  //上传执照
  upLicense(event) {
    let files = event.target.files;
    let formdata = new FormData();
    for (let i = 0; i < files.length; i++) {
      formdata.append("files", files[i]);
    };
    //调用上传接口
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/store/license", formdata, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        GlobalALert.getAlert({ message: data.msg });
        this.licenses = data.data;
      });
  }

  //查询执照
  queryLicense(event) {
    let el = document.getElementsByClassName("license")[0];
    if (this.licenses == null) {
      //切换转动特效
      (el.getAttribute("hidden") == 'true') ? el.removeAttribute("hidden") : el.setAttribute("hidden", "true");
      //请求数据
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/license/" + localStorage.getItem("storeId"), GlobalFinal.HEADER)
        .subscribe((data: any) => {
          if (data.stausCode == 200) {
            //将数据绑定
            this.licenses = data.data;
            //显示隐藏的数据
            document.getElementsByClassName("license")[0].removeAttribute("hidden");
          }
        });
    } else {
      //切换显示
      (el.getAttribute("hidden") == 'true') ? el.removeAttribute("hidden") : el.setAttribute("hidden", "true");
    }
  }
}
