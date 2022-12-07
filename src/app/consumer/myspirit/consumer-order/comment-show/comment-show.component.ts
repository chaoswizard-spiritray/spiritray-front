import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-comment-show',
  templateUrl: './comment-show.component.html',
  styleUrls: ['./comment-show.component.scss'],
})
export class CommentShowComponent implements OnInit {
  comments;

  constructor(
    private router: Router,
    private hr: HttpClient,
    private navController: NavController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() { this.queryCommentByPhone(); }


  back() {
    let num = 0;
    if (this.comments) {
      num = this.comments.length;
    }
    //回退上一页，开启通知
    this.modalController.dismiss(num);
    //location.replace("/consumer/myspirit");
  }

  queryCommentByPhone() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/comment/consumer/phone", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        console.log(data.data);

        if (data.data != null) {
          this.comments = data.data;
        }
      });
  }

}
