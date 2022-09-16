import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, MenuController, ModalController } from '@ionic/angular';
import { GlobalFinal } from '../../dto-model/dto-model.component';
import { StoreRouterDataService } from '../../service/store-router-data.service';
import { PublishComponent } from './publish/publish.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  providers: [MenuController]
})
export class StoreComponent implements OnInit {

  constructor(
    private menu: MenuController,
    private router: Router,
    private hr: HttpClient,
    private srd: StoreRouterDataService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.queryStore();
  }

  //打开指定菜单
  openMenu(menuId: string) {
    if ("smaster" == menuId) {
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
    if ("smaster" == menuId) {
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
    this.closeMenu('smaster');
    //切换子路由
    this.skipPage(url);
  }

  //查询信息,因为后端会话中存储有phone，所以不用传参
  queryStore() {
    this.hr.get(GlobalFinal.SELLER_DOMAIN + "/store/storeInf/phone", GlobalFinal.JWTHEADER)
      .subscribe((data: any) => {
        //因为data本身就被转换为了一个Object，你通过．获取到的就是他的属性，这个就是一个对象，不用手动解析。就是说我们前端接收时完全不用转换
        this.srd.storeInf = data.data;
        localStorage.setItem("storeId", this.srd.storeInf.storeId);
        //判断当前店铺状态，如果是关闭就跳转封闭页面
        if (this.srd.storeInf.status == 0) {
          //将页面禁用，然后出口到子路由
          document.getElementsByClassName("outerMenuLog")[0].setAttribute("hidden", "true");
          this.router.navigateByUrl("/business/store/closed");
        }
      });
  }

  //刷新头部信息
  refreshing(event) {
    this.queryStore();
    setTimeout(() => { event.target.complete() }, 1000);
  }

  // 跳转指定页面
  skipPage(url: string) {
    this.router.navigateByUrl(url);
  }

  //打开指定组件modal
  async getModal(menuId, component) {
    //关闭子菜单和主菜单
    this.closeMenu(menuId);
    this.closeMenu('smaster');
    //打开模态框
    if ('publish' == component) {
      const modal = await this.modalController.create({
        component: PublishComponent,//模态框中展示的组件
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      return await modal.present();
    }
  }
}

