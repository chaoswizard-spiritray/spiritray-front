import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Category, GlobalALert, GlobalFinal } from '../../../dto-model/dto-model.component';
import { CategoryAttributeComponent } from './category-attribute/category-attribute.component';

@Component({
  selector: 'app-wares-category',
  templateUrl: './wares-category.component.html',
  styleUrls: ['./wares-category.component.scss'],
})
export class WaresCategoryComponent implements OnInit {
  categorys: Array<Category> = new Array();
  noAppend = true;
  checkedId = -1;
  timer;
  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.queryCategoryByFather();
  }

  queryCategoryByFather() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/category/0", GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.categorys = data.data;
      });
  }

  //三个参数分别是class名、categorys级别索引、级别中具体位置索引
  loadChildrenCate(fatherId) {
    if (fatherId != this.checkedId) {
      if (this.noAppend) {
        this.checkedId = fatherId;
        this.noAppend = false;
      } else {
        this.noAppend = true;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.checkedId = fatherId;
          this.noAppend = false;
        }, 1);
      }
    }
  }

  //展示属性模态框
  async showAttributeModal(categoryId, categoryName) {
    const modal = await this.modalController.create({
      component: CategoryAttributeComponent,
      componentProps: { 'categoryId': categoryId, 'categoryName': categoryName },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  //添加同级类别
  async addCate(fatherId) {
    //打开种类名输入框
    const alert = await this.alertController.create({
      header: '添加种类',
      buttons: [{ text: '取消', role: 'cancel' }, { text: '提交', role: 'submit' }],
      inputs: [
        {
          placeholder: '种类名',
        }
      ]
    });
    await alert.present();
    const { data, role } = await alert.onDidDismiss();
    if (role == 'submit' && data) {
      if (data.values[0] == '') {
        GlobalALert.getAlert({ message: "空名" });
        return;
      } else {
        //通过后台创建后返回category再加入到当前数组中
        const formdata = new FormData();
        formdata.append('cate', JSON.stringify(new Category(-1, data.values[0], fatherId)));
        this.hr.post(GlobalFinal.SELLER_DOMAIN + "/cav/category/add", formdata, GlobalFinal.PLAT_HEADER)
          .subscribe((data: any) => {
            GlobalALert.getAlert({ message: data.msg });
            if (data.stausCode == 200) {
              this.categorys.push(data.data);
            }
          });
      }
    }
  }

}


@Component({
  selector: 'app-cate-accordion',
  styleUrls: ['./wares-category.component.scss'],
  template:
    `
    <ion-item class="addRow">
    <ion-button class="addTopClass" slot="end" (click)="addCate()">
      新增
    </ion-button>
  </ion-item>
  <ion-accordion-group *ngIf="categorys.length>0">
    <ion-accordion  *ngFor="let cate of categorys;index as i" [value]="cate.categoryId">
      <div [class]="cateStyleClass"
        (click)="loadChildrenCate(cate.categoryId)" slot="header">
        <span slot="start">{{cate.categoryName}}</span>
        <span style="float: right;" (click)="showAttributeModal(cate.categoryId, cate.categoryName)">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </span>
      </div>
      <ng-container *ngIf="noAppend;else default">
      </ng-container>
    </ion-accordion>
  </ion-accordion-group>
  <ng-template #default>
    <app-cate-accordion slot="content" [fatherId]="checkedId" [cateStyleClass]="nextStyleClass"></app-cate-accordion>
  </ng-template>
    `
})

export class CateAccordionComponent implements OnInit {

  @Input() fatherId = 0;
  @Input() cateStyleClass = '';
  nextStyleClass = '';
  categorys: Array<Category> = new Array();
  noAppend = true;
  checkedId = -1;
  timer: any;

  constructor(
    private hr: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.queryCategoryByFather();
  }


  queryCategoryByFather() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/category/" + this.fatherId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        this.categorys = data.data;
      });
  }

  loadChildrenCate(fatherId) {
    this.nextStyleClass = "type" + (parseInt(this.cateStyleClass.split('type')[1]) + 1)
    if (fatherId != this.checkedId) {
      if (this.noAppend) {
        this.checkedId = fatherId;
        this.noAppend = false;
      } else {
        this.noAppend = true;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.checkedId = fatherId;
          this.noAppend = false;
        }, 1);
      }
    }
  }

  //展示属性模态框
  async showAttributeModal(categoryId, categoryName) {
    const modal = await this.modalController.create({
      component: CategoryAttributeComponent,
      componentProps: { 'categoryId': categoryId, 'categoryName': categoryName },
      handle: false,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }


  //添加同级类别
  async addCate() {
    //打开种类名输入框
    const alert = await this.alertController.create({
      header: '添加种类',
      buttons: [{ text: '取消', role: 'cancel' }, { text: '提交', role: 'submit' }],
      inputs: [
        {
          placeholder: '种类名',
        }
      ]
    });
    await alert.present();
    const { data, role } = await alert.onDidDismiss();
    if (role == 'submit' && data) {
      if (data.values[0] == '') {
        GlobalALert.getAlert({ message: "空名" });
        return;
      } else {
        //通过后台创建后返回category再加入到当前数组中
        const formdata = new FormData();
        formdata.append('cate', JSON.stringify(new Category(-1, data.values[0], this.fatherId)));
        this.hr.post(GlobalFinal.SELLER_DOMAIN + "/cav/category/add", formdata, GlobalFinal.PLAT_HEADER)
          .subscribe((data: any) => {
            GlobalALert.getAlert({ message: data.msg });
            if (data.stausCode == 200) {
              this.categorys.push(data.data);
            }
          });
      }
    }
  }

}