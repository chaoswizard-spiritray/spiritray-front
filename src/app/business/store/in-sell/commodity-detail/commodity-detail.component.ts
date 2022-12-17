import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { async } from 'rxjs';
import { GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-commodity-detail',
  templateUrl: './commodity-detail.component.html',
  styleUrls: ['./commodity-detail.component.scss'],
})
export class CommodityDetailComponent implements OnInit {

  @Input() commodityId;

  details = new Array();
  tempDetails = new Array();
  newFiles = new Array();
  checkBox = new Array();
  isHiddenFotter = false;
  isHiddenCheck = true;
  isNeedSave = false;

  imgStyle = `display: inline-block;width:100%;`;

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.queryCommodityDetail();
  }

  //删除已经选中的图片
  deleteImg() {
    for (let i = 0; i < this.checkBox.length; i++) {
      if (this.checkBox[i]) {
        this.isNeedSave = true;//需要提交保存
        const imhUrl: string = this.tempDetails[i];
        this.newFiles.splice(i, 1);
        this.tempDetails.splice(i, 1);
      }
    }
    if (this.tempDetails.length == 0) {
      this.isHiddenCheck = true;
    }
  }

  //切换管理开关
  toggleCheck() {
    if (this.tempDetails.length == 0) {
      GlobalALert.getToast("没有可管理的对象");
      return;
    }
    if (this.isHiddenCheck) {
      this.imgStyle = `display: inline-block;width: 300px;`;
    } else {
      this.imgStyle = `display: inline-block;width: 100%;`;
    }
    this.isHiddenCheck = this.isHiddenCheck ? false : true;
  }

  //获取商品详情信息
  queryCommodityDetail() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/commodity/detail/all/" + this.commodityId, GlobalFinal.STORE_HEADER)
      .subscribe((data: any) => {
        if (data.data != null && data.data.length > 0) {
          this.tempDetails = data.data;
          this.tempDetails.forEach(el => {
            this.newFiles.push(null);
            this.checkBox.push(false);
          });
        }
      });
  }

  //关闭模态框
  async back() {
    if (this.isNeedSave) {
      if (await GlobalALert.getSureAlert("你的编辑没有保存，要退出吗？") == "confirm") {
        this.modalController.dismiss();
      }
    } else {
      this.modalController.dismiss();
    }
  }

  //添加图片
  addImg(event) {
    this.isNeedSave = true;
    const files = new Array(...event.target.files);
    //将图片添加
    this.newFiles.push(...files);
    files.forEach(element => {
      this.tempDetails.push(URL.createObjectURL(element));
      this.checkBox.push(false);
    });
  }

  //交换后同步到数据进行交换
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.isNeedSave = true;
    this.content.scrollEvents = false;
    //交换元素
    const fromIndex = ev.detail.from;
    const toIndex = ev.detail.to;
    const newDetail = new Array(...this.tempDetails);
    const newTempFiles = new Array(...this.newFiles);
    const newCheckBox = new Array(...this.checkBox);
    //如果是将元素往下移
    if (fromIndex < toIndex) {
      //先将移动元素追加目标位置，到然后再将移动元素从原位置删除
      newTempFiles.splice(toIndex + 1, 0, this.newFiles[fromIndex]);
      newCheckBox.splice(toIndex + 1, 0, this.checkBox[fromIndex]);
      newDetail.splice(toIndex + 1, 0, this.tempDetails[fromIndex]);
      newDetail.splice(fromIndex, 1);
      newTempFiles.splice(fromIndex, 1);
      newCheckBox.splice(fromIndex, 1);
      this.tempDetails = newDetail;
      this.newFiles = newTempFiles;
      this.checkBox = newCheckBox;
    } else {
      //如果往上移就需要删除+1的位置
      newTempFiles.splice(toIndex + 1, 0, this.newFiles[fromIndex]);
      newCheckBox.splice(toIndex + 1, 0, this.checkBox[fromIndex]);
      newDetail.splice(toIndex + 1, 0, this.tempDetails[fromIndex]);
      newDetail.splice(fromIndex + 1, 1);
      newTempFiles.splice(fromIndex + 1, 1);
      newCheckBox.splice(fromIndex + 1, 1);
      this.tempDetails = newDetail;
      this.newFiles = newTempFiles;
      this.checkBox = newCheckBox;
    }
    ev.detail.complete();
    this.content.scrollEvents = true;
  }

  //滚动开始时
  scrollStart() {
    this.isHiddenFotter = true;
  }

  //滚动停止时
  scrollEnd() {
    this.isHiddenFotter = false;
  }

  //保存信息
  submitDetail() {
    const formdata = new FormData();
    this.newFiles.forEach(el => {
      formdata.append("files", el);
    });
    formdata.append("commodityId", this.commodityId);
    formdata.append("detail", JSON.stringify(this.tempDetails));
    this.hr.post(GlobalFinal.SELLER_DOMAIN + "/commodity/detail/up", formdata, GlobalFinal.STORE_HEADER).subscribe((data: any) => {
      GlobalALert.getAlert({ message: data.msg });
      if (data.stausCode == 200)
        this.isNeedSave = false;
    });
  }

}
