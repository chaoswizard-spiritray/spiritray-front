import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { Attribute, GlobalALert, GlobalFinal } from '../../../../dto-model/dto-model.component';

@Component({
  selector: 'app-category-attribute',
  templateUrl: './category-attribute.component.html',
  styleUrls: ['./category-attribute.component.scss'],
})
export class CategoryAttributeComponent implements OnInit {
  @Input() categoryId = 0;
  @Input() categoryName = '';

  //内容组件视图引用
  @ViewChild(IonContent) content: IonContent;//滚动条

  attributes: Array<Attribute> = new Array();
  appendAttributes: Array<Attribute> = new Array();

  constructor(
    private router: Router,
    private hr: HttpClient,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.queryAttribute();
  }

  //获取种类的属性
  queryAttribute() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/cav/attribute/" + this.categoryId, GlobalFinal.PLAT_HEADER)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.attributes = data.data;
        }
      });
  }

  deleteAttribute(index) {
    console.log(index);
    this.appendAttributes.splice(index, 1);
  }

  appendCate() {
    this.appendAttributes.push(new Attribute(-1, '', 0, 0));
    this.content.scrollToBottom(500);
  }

  async submitData() {
    if (await GlobalALert.getSureAlert("提交后不可再修改") == 'confirm') {
      //插入数据
      const formdata = new FormData();
      formdata.append("attributes", JSON.stringify(this.appendAttributes));
      formdata.append("categoryId", this.categoryId + "");
      this.hr.post(GlobalFinal.SELLER_DOMAIN + "/cav/attribute/add/many", formdata, GlobalFinal.PLAT_HEADER).subscribe(async (data: any) => {
        await GlobalALert.getAlert({ message: data.msg });
        if (data.stausCode == 200) {
          this.attributes.push(...data.data);
          this.appendAttributes = [];
        }
      });
    }
  }






}
