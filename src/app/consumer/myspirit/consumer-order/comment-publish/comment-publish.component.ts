import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

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

  comment: any = "";
  starLevel: any = 0;
  isAnonymous: any = true;

  file: any;
  imgHidden = true;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }


  upload(event) {
    //显示全屏
    this.file = event.target.files[0];
    document.getElementsByClassName("showImg")[0].setAttribute("src", window.URL.createObjectURL(this.file));
    document.getElementsByClassName("showImg")[1].setAttribute("src", window.URL.createObjectURL(this.file));
  }



  showAll() {
    if (this.file !== undefined) {
      this.imgHidden = false;
    }
  }

  clearShow() {
    this.imgHidden = true;
  }

  back() {
    this.modalController.dismiss();
  }

  // 发布评论
  publishComment() {
    //检测数据
    if (this.comment == '' || this.starLevel == 0) {
      GlobalALert.getAlert({ 'message': '请将信息填写完整' });
    }
    //数据封装
    const comment = {
      'commentNo': '',
      'orderNumber': this.orderNumber,
      'odId': this.odId,
      'commodityId': this.commodityId,
      'consumerPhone': 0,
      'commentContent': this.comment,
      'attchedMap': '',
      'starLevel': this.starLevel,
      'isAnonymous': this.isAnonymous ? 1 : 0,
      'startDate': null
    }
    const formdata = new FormData();
    formdata.append("comment", JSON.stringify(comment));
    if (this.file) {
      formdata.append("file", this.file);
    }
    //发布请求
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/comment/one", formdata, GlobalFinal.JWTHEADER).subscribe((data: any) => {
      GlobalALert.getToast(data.msg);
      if (data.stausCode == 200) {
        this.modalController.dismiss(true);
      }
    });
  }

  //选择星级
  lightStar(num) {
    this.starLevel = num;
  }

}
