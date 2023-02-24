import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.scss'],
})
export class DoorComponent implements OnInit {
  url = "../../assets/img/icon.png";
  trimer;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.trimer = setTimeout(() => { this.router.navigate(['/consumer']); }, 2000);
  }
  ionViewWillLeave() {
    clearTimeout(this.trimer);
  }

}
