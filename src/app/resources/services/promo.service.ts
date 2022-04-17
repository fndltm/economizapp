import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Promo } from '../models/promo';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PromoService extends BaseService<Promo> {
  constructor(public firestore: Firestore) {
    super(firestore, 'promos');
  }
}
