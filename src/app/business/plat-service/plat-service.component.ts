import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-plat-service',
  templateUrl: './plat-service.component.html',
  styleUrls: ['./plat-service.component.scss'],
})
export class PlatServiceComponent implements OnInit {

  constructor(
    private hr: HttpClient,
    private menu: MenuController,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  //打开指定菜单
  openMenu(menuId: string) {
    if ("pmaster" == menuId) {
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
    if ("pmaster" == menuId) {
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
  skip(menuId, url) {
    this.closeMenu(menuId);
    this.closeMenu('pmaster');
    //切换子路由
    this.skipPage(url);
  }

  // 跳转指定页面
  skipPage(url: string) {
    this.router.navigateByUrl(url)
  }
}