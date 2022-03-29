import { EventEmitter, Injectable, Output } from '@angular/core';
import { Promo } from '../models/promo';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  @Output() promo$ = new EventEmitter<Promo>();

  constructor() { }

  setPromo(promo) {
    this.promo$.emit(promo);
  }
}
