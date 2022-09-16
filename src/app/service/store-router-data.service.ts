import { Injectable } from '@angular/core';
import { Consumer, Store } from '../dto-model/dto-model.component';

@Injectable({
  providedIn: 'root'
})
export class StoreRouterDataService {
  public storeInf: Store = null;
  public userInf: Consumer = null;

  constructor() { }
}
