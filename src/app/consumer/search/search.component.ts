import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

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
  //搜索数据 
  constructor(private router: Router) { }

  // 组件数据初始化后调用
  ngOnInit() {
    // 搜索框聚焦弹出输入键盘,组件只会初始化一次，其他页面进入时才会触发，刷新不会
    this.searchbar.setFocus();
  }

  // 跳转商品查询子组件
  queryCommodity() {
    let word = this.searchbar.value;
    if (this.isAccess(word)) {
      //先更新历史记录
      this.updateHistory(word);
      // 跳转路径
      this.router.navigateByUrl("search/result" + "/" + word);
    }
    // 将搜索框的值置为空
    this.searchbar.value = "";
  }

  //判断输入内容是否有效
  isAccess(word: string): boolean {
    //是否为空、空字符、或者去掉连续空格后长度为0
    if (word == null || word.length == 0 || word.replace("(^[ ]+)|([ ]+$)", "").length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //更新历史记录
  updateHistory(word: string) {
    // 获取缓存中的记录
    let words: any;
    words = JSON.parse(localStorage.getItem("historyWord"));
    //检测当前词是否在缓存中，在就删除，并将当前词加入缓存
    if (words == null) {
      words = new Array();
    }
    let index = words.indexOf(word);
    if (index > -1) {
      words.splice(index, 1);
    }
    words.unshift(word);
    localStorage.setItem("historyWord", JSON.stringify(words));
  }


}
