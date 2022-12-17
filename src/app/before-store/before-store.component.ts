import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../dto-model/dto-model.component';
import { ImgShowComponent } from '../img-show/img-show.component';
import { MsgDetailComponent } from '../msg-detail/msg-detail.component';
import { ClsoeInfoMenuComponent } from './clsoe-info-menu/clsoe-info-menu.component';

@Component({
  selector: 'app-before-store',
  templateUrl: './before-store.component.html',
  styleUrls: ['./before-store.component.scss'],
})
export class BeforeStoreComponent implements OnInit {
  storeId: string;
  type = 0;//0表示买家1表示平台
  isAttention = false;
  isClose = false;
  storeInfo;
  storePhone;

  //买家视图
  fullScreen: boolean = false;
  topFlag: boolean = false;
  tintColor: string = '#108ee9';
  unselectedTintColor: string = '#888';
  tabbarStyle: object = { height: '100%' };
  selectedIndex: number = 0;

  //店铺所有商品信息
  allCommoditys = new Array();
  //最近商品信息
  recentCommoditys = new Array();
  //店铺所有种类
  categorys = new Array();
  //指定种类商品信息
  cateCommoditys = new Array();
  checkIndex = 0;//加载评论类别
  lastIndex = -1;//上次加载的类别

  //店铺执照
  license = new Array();


  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getStoreId();
  }

  ionViewWillEnter() {
  }

  // 解析url参数
  getStoreId() {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.storeId = data.storeId;
      this.type = data.type;
      this.storePhone = data.storePhone;
      this.queryStoreInfo();
      this.queryAllCommodity();
      this.queryRecentCommodity();
      this.queryCategorys();
      this.queryIsAttention();
      if (this.type == 1) {
        this.queryLicense();
      }
    });
  }

  // 切换评论类型
  changeType(index) {
    //修改选中索引
    this.lastIndex = this.checkIndex;
    this.checkIndex = index;
    //清空数据
    this.cateCommoditys = [];
    //设置
    document.getElementsByTagName("ion-chip")[this.checkIndex].setAttribute("color", "danger");
    document.getElementsByTagName("ion-chip")[this.lastIndex].setAttribute("color", "primary");
    //加载数据
    this.queryCateCommoditys();
  }

  //查询买家是否关注了店铺
  queryIsAttention() {
    this.hr.get(GlobalFinal.DOMAIN + "/consumer/attention/" + this.storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.isAttention = true;
        }
      });
  }

  //添加关注
  async attention() {
    if (localStorage.getItem("jwt") == null) {
      //如果为空
      await GlobalALert.getAlert({ message: "请登录" });
      this.router.navigate(["/consumer/login"], {});
    } else {
      this.hr.post(GlobalFinal.DOMAIN + "/consumer/attention/" + this.storeId, {}, GlobalFinal.JWTHEADER)
        .subscribe((data: any) => {
          GlobalALert.getToast(data.msg);
          if (data.stausCode == 300) {
            this.router.navigate(["/consumer/login"], {});
          } else {
            this.isAttention = true;
          }
        });
    }
  }
  //取消关注
  cancelAttention() {
    this.hr.put(GlobalFinal.DOMAIN + "/consumer/attention/" + this.storeId, {}, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        GlobalALert.getToast(data.msg);
        if (data.stausCode == 300) {
          this.router.navigate(["/consumer/login"], {});
        } else {
          if (data.msg == "已取消")
            this.isAttention = false;
        }
      });
  }

  //根据id查询店铺信息
  queryStoreInfo() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + this.storeId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        this.storeInfo = data.data;
        //判断信息状态
        if (this.storeInfo.status != 1) {
          //如果店铺状态不为打开，跳转店铺关闭页面
          this.router.navigate(["/before-store/close"],
            {
              queryParams: {
                'role': this.type,
                'storeInfo': JSON.stringify(this.storeInfo)
              }
            })
        }
      });
  }

  //查询所有商品
  queryAllCommodity() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/all/" + this.storeId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null || data.data.length > 0) {
          this.allCommoditys = data.data;
        }
      });
  }

  //查询最近上架的商品
  queryRecentCommodity() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/recent/" + this.storeId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null || data.data.length > 0) {
          this.recentCommoditys = data.data;
        }
      });
  }
  // 查询商品种类
  queryCategorys() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/cate/" + this.storeId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null || data.data.length > 0) {
          this.categorys = data.data;
        }
      });
  }

  // 查询商品种类下的商品信息
  queryCateCommoditys() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/before/store/all/" + this.storeId + "/" + this.categorys[parseInt(this.checkIndex + "")].categoryId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.data != null || data.data.length > 0) {
          this.cateCommoditys = data.data;
        }
      });
  }

  //查询店铺执照
  queryLicense() {
    //请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/license/" + this.storeId, GlobalFinal.HEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          //将数据绑定
          this.license = data.data;
        }
      });
  }

  //查看大图
  //显示图片全屏
  async showAll(license) {
    const modal = await this.modalController.create({
      component: ImgShowComponent,//模态框中展示的组件
      componentProps: {
        "url": license
      }
    });
    return await modal.present();
  }


  //打开消息
  openMsgDetail() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/" + this.storeId, GlobalFinal.JWTHEADER)
      .subscribe(async (data: any) => {
        //打开消息细节模态框
        const modal = await this.modalController.create({
          component: MsgDetailComponent,//模态框中展示的组件
          handle: false,
          componentProps: {
            'receiverName': data.data.storeName,
            'receiverHead': data.data.storeHead,
            'receiverRole': 2,
            'receiverId': this.storePhone,
            'senderRole': 1
          },
          swipeToClose: true,
          presentingElement: await this.modalController.getTop()
        });
        await modal.present();
        //如果关闭就退回到所有商品
        const { data: any } = await modal.onDidDismiss();
        this.selectedIndex = 0;
      });
  }

  //点击商品时
  //如果是买家进入商品购买页面
  toCommodity(commodityId) {
    if (this.type == 0) {
      this.router.navigate(['/consumer/shop'], {
        queryParams: {
          'commodityId': commodityId
        }
      });
    }
  }

  //切换
  tabBarTabOnPress(pressParam: any) {
    if (pressParam.key == 4) {
      //如果是切换到消息通信，打开消息
      this.openMsgDetail();
    }
    //如果是分类先预先设置
    if (pressParam.key == 3) {
      if (this.lastIndex == -1) {
        document.getElementsByTagName("ion-chip")[this.checkIndex].setAttribute("color", "danger");
        this.queryCateCommoditys();
      } else {
        this.changeType(0);
      }
    }
    this.selectedIndex = pressParam.index;
  }

  //查封店铺
  async plantCloseStore() {
    console.log(this.storeInfo.storeHead);
    console.log(this.storeInfo.storeName);
    const modal = await this.modalController.create({
      component: ClsoeInfoMenuComponent,//模态框中展示的组件
      handle: false,
      componentProps: {//店铺信息
        'role': 0,
        'type': 0,
        'storeHead': this.storeInfo.storeHead,
        'storeName': this.storeInfo.storeName
      },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    //如果关闭就退回到所有商品
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      //调用查封店铺
    }
  }

  //回退
  back() {
    this.navController.back();
  }


}
