import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { GlobalFinal } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  //占位词
  private placeholderWord = "spiritray";
  //搜索框子视图对象注入
  @ViewChild("searchbar", { static: true })
  private searchbar: IonSearchbar;
  //监听回车
  enterKeyOb = GlobalFinal.createKeyDown();
  inputOb: Subscription;
  //输入框内容
  word: string;
  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private navController: NavController) { }

  // 组件数据初始化后调用
  ngOnInit() {
    this.initInputEvent();
  }

  //初始化监听输入框，确定什么时候提交查询请求
  initInputEvent() {
    //当输入框聚焦时，我们注册接收键盘输入值
    this.searchbar.ionFocus.subscribe((data: any) => {
      this.inputOb = this.enterKeyOb.subscribe((data: any) => {
        //按下回车跳转
        this.queryCommodity();
      });
    });
    //当输入框失去焦点时，取消观察
    this.searchbar.ionBlur.subscribe((data: any) => {
      this.inputOb.unsubscribe();
    });
  }

  // 跳转商品查询子组件
  queryCommodity() {
    //去除空格
    const temp = this.word.replace(" ", "");
    if (this.word != "") {
      //添加信息到历史搜索
      this.updateHistory(this.word);
      // 跳转路径
      this.router.navigate(['/consumer/search/result'],
        {
          queryParams: {
            'word': this.word
          }
        });
    }
    // 将搜索框的值置为空
    this.searchbar.value = "";
  }

  //更新历史记录
  updateHistory(word: string) {
    // 获取缓存中的记录
    let words: any = localStorage.getItem("historyWord");
    //检测当前词是否在缓存中，在就删除，并将当前词加入缓存
    if (words == null || !words) {
      words = JSON.stringify(new Array());
    }
    words = JSON.parse(words);
    let index = words.indexOf(word);
    if (index > -1) {
      words.splice(index, 1);
    }
    words.unshift(word);
    localStorage.setItem("historyWord", JSON.stringify(words));
  }

  //返回上一页
  back() {
    this.navController.pop();
  }

}
