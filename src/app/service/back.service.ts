import { Injectable } from '@angular/core';

@Injectable(
  {
    providedIn: "root"
  }
)
export class BackService {

  constructor(
    public isBack: Boolean
  ) { }
}
