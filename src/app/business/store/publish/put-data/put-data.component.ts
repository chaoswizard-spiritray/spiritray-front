import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-put-data',
  templateUrl: './put-data.component.html',
  styleUrls: ['./put-data.component.scss'],
})
export class PutDataComponent implements OnInit {
  price: string;
  num: number;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  submit() {
    this.popoverController.dismiss({ 'price': this.price, 'num': this.num });
  }


}
