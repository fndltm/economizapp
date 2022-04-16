import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromoStatus } from '@enums/promo-status';
import { Timestamp } from 'firebase/firestore';
import { PromoService } from 'src/app/resources/services/promo.service';
import { Promo } from '../../resources/models/promo';

@Component({
  selector: 'app-home',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage implements OnInit {
  public promos: Promo[];

  constructor(
    private router: Router,
    private promoService: PromoService
  ) {
    /* for (let index = 1; index < 16; index++) {
      this.promoService.add({
        address: 'address' + index,
        category: 'category' + index,
        createdAt: new Date(2022, 4, 16, index, index, index),
        createdBy: 'createdBy' + index,
        liked: true,
        likes: index,
        photo: 'photo' + index,
        price: index,
        product: 'product' + index,
        status: PromoStatus.active,
        store: 'store' + index,
      }).subscribe();
    } */

    this.promoService.getOrderByLimit('createdAt', 5).subscribe(promos => this.promos = [...promos]);
  }

  ngOnInit(): void {
  }

  loadData(event): void {
    console.log('entrou loadData');

    setTimeout(() => {
      this.promoService.getOrderByStartAfterLimit('createdAt', this.promos[this.promos.length - 1].createdAt, 5).subscribe(promos => {
        this.promos.push(...promos);
        event.target.complete();
      });
    }, 500);
  }

  public formatDate(date: Timestamp): string {
    return formatDate(new Date(date.seconds), 'dd/MM/yyyy', 'en-US');
  }

  goToPromo(promo) {
    this.promoService.setPromo(promo);
    this.router.navigate(['/promo']);
  }

  togglePromoLike(promo: Promo): void {
    const p = { ...promo };
    p.liked = !p.liked;
    if (p.liked) { p.likes++; }
    else { p.likes--; }

    this.promoService.update(p);
  }

}
