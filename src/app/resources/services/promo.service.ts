import { EventEmitter, Injectable, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Promo } from '../models/promo';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PromoService extends BaseService<Promo> {
  @Output() promo$ = new EventEmitter<Promo>();

  constructor(public firestore: Firestore) {
    super(firestore, 'promos');
  }

  setPromo(promo) {
    this.promo$.emit(promo);
  }
}
