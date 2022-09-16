import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { NSMap } from '../../dto-model/dto-model.component';

@Component({
  selector: 'app-wares',
  templateUrl: './wares.component.html',
  styleUrls: ['./wares.component.scss'],
  providers: [MenuController]
})
export class WaresComponent implements OnInit {

  cateGoryF: Array<NSMap>;//一级种类目录


  constructor(
    private hr: HttpClient,
    private menu: MenuController,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  //打开指定菜单
  openMenu(menuId: string) {
    if ("wmaster" == menuId) {
      this.menu.enable(true, menuId);
      this.menu.open(menuId);
    } else {
      //如果已经打开就关闭
      if (document.getElementsByClassName(menuId)[0].getAttribute("hidden") == null) {
        this.closeMenu(menuId);
        return;
      }
      document.getElementsByClassName(menuId)[0].removeAttribute("hidden");
    }
  }

  //关闭指定菜单
  closeMenu(menuId: string) {
    if ("wmaster" == menuId) {
      this.menu.enable(false, menuId);
      this.menu.close(menuId);
      return;
    }
    document.getElementsByClassName(menuId)[0].setAttribute("hidden", "true");
  }

  // 关闭其它菜单
  closeOtherMenu(menuId: string) {
    let menuList = document.getElementsByClassName("salveMenu");
    for (let i = 0; i < menuList.length; i++) {
      if (menuList[i].getAttribute("class").indexOf(menuId) > -1) {
        continue;
      }
      menuList[i].setAttribute("hidden", "true");
    }
  }

  //打开指定菜单并关闭其他菜单
  openProductAndCloseOther(menuId: string) {
    this.openMenu(menuId);
    this.closeOtherMenu(menuId);
  }

  //切换挂载点时，同时关闭当前菜单栏
  skip(menuId, url, param) {
    this.closeMenu(menuId);
    this.closeMenu('wmaster');
    if (param == undefined) {
      this.router.navigateByUrl(url);
    } else {
      //切换子路由
      this.skipPage(url, param);
    }
  }

  // 跳转指定页面
  skipPage(url: string, param) {
    this.router.navigateByUrl(url + "/" + param);
  }
}
