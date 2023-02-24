import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { CommodityComment, GlobalFinal } from '../../../dto-model/dto-model.component';

@Component({
  selector: 'app-commodity-comment',
  templateUrl: './commodity-comment.component.html',
  styleUrls: ['./commodity-comment.component.scss'],
})
export class CommodityCommentComponent implements OnInit {
  @Input() commodityId: string;

  types = ["全部", "最近", "好评", "差评", "有图", "多次购买"];

  nums: Array<number> = [0, 0, 0, 0, 0, 0];

  checkIndex = 0;//加载评论类别

  lastIndex = -1;//上次加载的类别

  comments: Array<CommodityComment>;//评论信息

  pageNo = 0;

  pageNum = 5;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    //获取各类评论数目
    this.queryAllTypeCounts();
    //获取具体类别评论
    this.queryTypeComments();
  }

  ionViewDidEnter() {
    document.getElementsByTagName("ion-chip")[this.checkIndex].setAttribute("color", "danger");
  }

  //关闭模态框
  back() {
    this.modalController.dismiss();
  }

  //获取各类评论数目
  queryAllTypeCounts() {
    //创建多个请求对象同时请求，其实应该在服务端提供分类别统计所有数目然后返回，这样性能更高
    const arr = [
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 0, GlobalFinal.JWTHEADER),
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 1, GlobalFinal.JWTHEADER),
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 2, GlobalFinal.JWTHEADER),
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 3, GlobalFinal.JWTHEADER),
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 4, GlobalFinal.JWTHEADER),
      this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/counts/" + this.commodityId + "/" + 5, GlobalFinal.JWTHEADER)
    ];
    //开始请求
    forkJoin(arr).subscribe(([data0, data1, data2, data3, data4, data5]: Array<any>) => {
      if (data0.stausCode == 200) {
        this.nums[0] = data0.data;
      }
      if (data1.stausCode == 200) {
        this.nums[1] = data1.data;
      }
      if (data2.stausCode == 200) {
        this.nums[2] = data2.data;
      }
      if (data3.stausCode == 200) {
        this.nums[3] = data3.data;
      }
      if (data4.stausCode == 200) {
        this.nums[4] = data4.data;
      }
      if (data5.stausCode == 200) {
        this.nums[5] = data5.data;
      }
    });
  }

  //获取具体类别评论
  queryTypeComments() {
    //请求数据
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/" + this.commodityId + "/" + this.checkIndex + "/" + this.pageNo + "/" + this.pageNum, GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        if (data.stausCode == 200) {
          if (this.comments === undefined) {
            this.comments = data.data;
          } else {
            this.comments.concat(data.data);
            this.pageNo++;
          }
          return data.data;
        }
      });
  }

  // 切换评论类型
  changeType(index) {
    //修改选中索引
    this.lastIndex = this.checkIndex;
    this.checkIndex = index;
    //清空数据
    this.comments = undefined;
    this.pageNo = 0;
    //设置
    document.getElementsByTagName("ion-chip")[this.checkIndex].setAttribute("color", "danger");
    document.getElementsByTagName("ion-chip")[this.lastIndex].setAttribute("color", "primary");
    //加载数据
    this.queryTypeComments();
  }

  //加载下一页
  loadMoreData(event) {
    this.pageNo++;
    const data: any = this.queryTypeComments();
    event.target.complete();
    if (data == null || data.length == 0) {
      event.target.disabled = true;
      document.getElementsByClassName('dataover')[0].removeAttribute('hidden');
      setTimeout(() => {
        event.target.disabled = false;
        document.getElementsByClassName('dataover')[0].setAttribute('hidden', "true");
      }, 700);
    }
  }
}
