import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  // 封装一个条件传递到商品展示组件上，通过展示组件去请求数据

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // 建立异步监听keyWord提交情况,每次都会刷新都会
    this.route.params.subscribe((data) => {
      // 一旦提交就重新请求数据，然后绑定到商品展示组件上
     // this.sConditional.keyWord = data["keyWord"];
    });
  }
}
