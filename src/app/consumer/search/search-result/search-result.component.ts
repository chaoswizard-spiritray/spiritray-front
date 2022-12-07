import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;

  //滚动条停止位置
  currentY: number;
  topHidden = true;

  //商品信息
  commoditys = new Array();
  stores = new Array();
  checkCommodity = true;
  checkStore = false;
  word: string = "";


  // 封装一个条件传递到商品展示组件上，通过展示组件去请求数据

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.route.queryParams.subscribe((data: any) => {
      if (data.word) {
        this.word = data.word;
      }
      //调用查询
      this.querySearchCommodity();
    });
  }

  //查询商品信息
  querySearchCommodity() {
    //先去除空格
    this.word.toLowerCase();
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/consumer/search/" + this.word,)
      .subscribe((data: any) => {
        console.log(data.data);
      });
  }











  // 监听内容滚动
  scroll(event: CustomEvent) {
    this.currentY = event.detail.currentY;
  }

  //当停止时
  scrollEnd() {
    //判断滚动条位置
    if (this.currentY >= 69) {
      this.topHidden = false;
    } else {
      this.topHidden = true;
    }
  }

  //点击回到顶部
  toTop() {
    this.content.scrollToTop(200);
  }
}
