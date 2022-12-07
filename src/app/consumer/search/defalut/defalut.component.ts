import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defalut',
  templateUrl: './defalut.component.html',
  styleUrls: ['./defalut.component.scss'],
})
export class DefalutComponent implements OnInit {
  //历史记录
  private historyWord = [];
  //热词
  private hotWord = new Array<string>();
  constructor(private router: Router) { }

  ngOnInit() {
    // 执行历史记录加载
    this.getHistory();
    // 执行热词加载
    this.getHot();
  }

  //历史记录文字聚焦，显示×
  showDelete(event) {
    // 显示兄弟节点X
    var obj = event.target.parentNode;
    obj.lastChild.removeAttribute("hidden");
  }
  // 取消显示
  noShow(event) {
    var obj = event.target.parentNode.lastChild;
    setTimeout(() => {
      // 判断这个对象是否还在如果还在就关闭
      if (obj != null) {
        obj.setAttribute("hidden", "true");
      }
    }, 2000);

  }

  //将点击的词传入搜索
  tobar(event) {
    var word = event.target.innerText;
    //先将这个词从历史记录中更新，将这个元素放在首位
    this.historyWord.splice(this.historyWord.indexOf(word), 1);
    this.historyWord.unshift(word);
    //更新历史记录
    localStorage.setItem("historyWord", JSON.stringify(this.historyWord));
    //跳转查询
    this.router.navigate(["/consumer/search/result"], {
      queryParams: {
        "word": word
      }
    });
  }

  // 删除当前记录
  delete(event) {
    // 获取要删除的内容
    let word: any = event.target.parentNode.firstChild.innerText;
    //因为ng会自动绑定数据，所以只需要将数据删除即可
    this.historyWord.splice(this.historyWord.indexOf(word), 1);
    //然后更新缓存内容
    localStorage.setItem("historyWord", JSON.stringify(this.historyWord));
  }

  //清空所有历史记录
  deleteAll() {
    //不用js遍历删除，绑定数据后ng自动更新节点
    this.historyWord = [];
    localStorage.removeItem("historyWord");
  }

  // 判断是历史记录是否为空
  isNull(): boolean {
    if (this.historyWord == null) {
      return true;
    }
    return false;
  }

  //读取历史记录
  getHistory(): void {
    // 从缓存中加载历史记录
    const hisWord = localStorage.getItem("historyWord");
    if (hisWord != null || hisWord) {
      this.historyWord = JSON.parse(hisWord);
    }
  }
  //请求热词
  getHot(): void {

  }

}
