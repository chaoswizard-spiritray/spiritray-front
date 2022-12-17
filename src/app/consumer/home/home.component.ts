import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { GlobalFinal, HomeCommoditySimple, SlideShow } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  //无限滚动组件
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  // 轮播图片对象
  @ViewChild('slide1') slide1;
  slideOpts = {
    effect: 'flip',
    speed: 400,
    loop: true,
    autoplay: {
      delay: 2000
    }
  };
  // 轮播图片路径，从后台进行请求
  slideShows = new Array<SlideShow>();
  // 首页商品展示数据,将其注入到子组件中
  commoditys: Array<HomeCommoditySimple>;
  //分页的起始页
  pageNum: number = 0;
  //查询的条数
  recordNum: number = 12;

  //下次请求定时器
  trimer;
  //循环定时器
  circleTrimer;
  constructor(
    private httpRequest: HttpClient,
    private modalController: ModalController,
    private router: Router) { }

  //数据初始化
  ngOnInit() {
    this.queryHomeCommodity();
  }

  slideDidChange() {
    this.slide1.startAutoplay();
  }

  //每次进入页面时都会触发这个函数，不论是否初始化
  ionViewWillEnter() {
    this.querySlide();
    //循环定时加载轮播图
    this.circleTrimer = setInterval(() => { this.querySlide() }, 20000);
  }

  ionViewWillLeave() {
    clearTimeout(this.trimer);
    clearInterval(this.circleTrimer);
  }

  ngAfterViewInit() {
    //开启一个子线程进行运行防止冲突
    const pro = new Promise(() => {
      // 启动搜索图标周期缩放
      this.play(document.getElementById("realSea"));
      this.play(document.getElementById("sea"));
    });
  }

  // https://www.cnblogs.com/shiweida/p/7785185.html
  // https://www.cnblogs.com/surfaces/p/4324044.html
  play(obj): void {
    var trs = obj.style;
    var flag: boolean = true;
    var time = setInterval(() => {
      if (flag) {
        trs.transition = "transform .5s ease 0s";
        trs.transform = "scale(1.3,1.3)";
      } else {
        trs.transition = "transform .5s ease 0s";
        trs.transform = "scale(1,1)";
      }
      flag = !flag;
    }, 1000);
  }

  //跳转店铺
  toBeforeStore(storeId) {
    //获取店铺电话
    this.httpRequest.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/phone/" + storeId, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        this.router.navigate(["/before-store"], {
          queryParams: {
            'storeId': storeId,
            'type': 0,
            'storePhone': data.data
          }
        });
      });

  }

  //数据无限加载
  loadData(event) {
    const data = this.queryHomeCommodity();
    event.target.complete();
    if (data == null) {
      event.target.disabled = true;
      document.getElementsByClassName('dataover')[0].removeAttribute('hidden');
      setTimeout(() => {
        event.target.disabled = false;
        document.getElementsByClassName('dataover')[0].setAttribute('hidden', "true");
      }, 700);
    }
  }

  // 加载轮播图
  querySlide() {
    clearTimeout(this.trimer);
    this.httpRequest.get(GlobalFinal.PLANT_DOMAIN + "/plant/slide/consumer/get", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data == null) {
          this.slideShows = new Array();
        } else {
          this.slideShows = data.data.slideShows;
          setTimeout(() => { this.querySlide() }, data.data.seconds);
        }
      });
  }

  //请求首页商品数据
  queryHomeCommodity() {
    let head = GlobalFinal.HEADER;
    if (localStorage.getItem("jwt") != null) {
      head = GlobalFinal.JWTHEADER;
    }
    this.httpRequest.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/home/" + this.pageNum + "/" + this.recordNum, head)
      .subscribe((data: any) => {
        if (data.data != null) {
          if (this.commoditys === undefined) {
            this.commoditys = new Array<HomeCommoditySimple>();
          }
          this.commoditys.push(...data.data);
          this.pageNum++;
          if (data.data.length == 0) {
            this.pageNum = 0;
            this.queryHomeCommodity();
          }
        }
        return data.data;
      });
  }

  //进入商品购买页面
  toCommodity(commodityId) {
    this.router.navigate(['/consumer/shop'], {
      queryParams: {
        'commodityId': commodityId
      }
    });
  }
}
