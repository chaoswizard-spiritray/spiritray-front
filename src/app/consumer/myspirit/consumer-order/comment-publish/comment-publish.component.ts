import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-comment-publish',
  templateUrl: './comment-publish.component.html',
  styleUrls: ['./comment-publish.component.scss'],
})
export class CommentPublishComponent implements OnInit {
  @Input()
  orderNumber: string;

  @Input()
  odId: number;

  @Input()
  commodityId: string;






  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() { }

  back() {
    this.navController.back();
  }

  // 发布评论
  publishComment() {
    //检测数据
    //数据封装
    const comment =
    //发布请求
  }

}
