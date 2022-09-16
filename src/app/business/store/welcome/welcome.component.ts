import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private hr: HttpClient) { }

  ngOnInit() {//将图标隐藏
    setTimeout(() => {
      let el: any = document.getElementsByClassName("welcomCard")[0].lastChild.lastChild;
      el.innerText = "DO BUSINESS";
      el.style.fontSize = "95%";
    }, 5000);
  }
}
