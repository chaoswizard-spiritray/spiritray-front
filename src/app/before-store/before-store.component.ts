import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-before-store',
  templateUrl: './before-store.component.html',
  styleUrls: ['./before-store.component.scss'],
})
export class BeforeStoreComponent implements OnInit {
  storeId: string;

  constructor(
    public hr: HttpClient,
    public router: Router,
    public activate: ActivatedRoute
  ) { }

  ngOnInit() { }

  // 解析url参数
  getStoreId() {
    this.activate.queryParams.subscribe((data: any) => {
      this.storeId = data.storeId;
    });
  }

  //


}
