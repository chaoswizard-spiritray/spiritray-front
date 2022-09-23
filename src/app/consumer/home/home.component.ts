import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonSlides, ModalController } from '@ionic/angular';
import { GlobalFinal, HomeCommoditySimple, SlideShow } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  //无限滚动组件
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  tests = [1, 2, 3, 4, 5, , 6, 7, 7, 8, 9, 9, , 0, 0];
  // 轮播图片对象
  @ViewChild('homeSlides', { static: true })
  private homeSlides: IonSlides;
  // 轮播图片路径，从后台进行请求
  private slideShows = new Array<SlideShow>();
  // 首页商品展示数据,将其注入到子组件中
  commoditys: Array<HomeCommoditySimple>;
  //分页的起始页
  pageNum: number = 0;
  //查询的条数
  recordNum: number = 12;

  constructor(
    private httpRequest: HttpClient,
    private modalController: ModalController,
    private router: Router) { }

  //数据初始化
  ngOnInit() {
    this.queryHomeCommodity();
    this.querySlide();

  }

  ngAfterViewInit() {
    //开启一个子线程进行运行防止冲突
    const pro = new Promise(() => {
      // 启动搜索图标周期缩放
      this.play(document.getElementById("realSea"));
      this.play(document.getElementById("sea"));
    });
    //开启刷新
    this.refreshHome();
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

  //额外定时器定时刷新数据
  refreshHome() {
    this.commoditys = [];
    this.queryHomeCommodity();
    setTimeout(() => {
      this.refreshHome();
    }, 30000);
  }

  //数据无限加载
  loadData(event) {
    const data = this.queryHomeCommodity();
    event.target.complete();
    if (data == null) {
      event.target.disabled = true;
      document.getElementsByClassName('dataover')[0].removeAttribute('hidden');
      setTimeout(() => { event.target.disabled = false }, 3000);
    }
  }

  // 加载轮播图
  querySlide() {
    this.httpRequest.get(GlobalFinal.PLANT_DOMAIN + "/plant/slideshow", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          this.slideShows = data.data.slideshows;
          // 开始自动播放
          this.homeSlides.startAutoplay();
          //设置定时器，定时再请求一次
          setTimeout(() => { this.querySlide(); }, data.data.time * 1000);
        } else {
          //否则说明网络或者redis故障，我们等一下再请求
          setTimeout(() => { this.querySlide(); }, 50000);
        }
      });
  }

  //请求首页商品数据
  queryHomeCommodity() {
    this.httpRequest.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/home/" + this.pageNum + "/" + this.recordNum, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.data != null) {
          if (this.commoditys === undefined) {
            this.commoditys = new Array<HomeCommoditySimple>();
          }
          this.commoditys.push(...data.data);
          this.pageNum++;
        }
        return data.data;
      });
  }

  //进入店铺
  enterStore(storeId: number) {
    this.router.navigateByUrl("/business/store/before?storeId=" + storeId);
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
