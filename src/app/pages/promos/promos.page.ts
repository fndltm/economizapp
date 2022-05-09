import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UtilsService } from '@utils/utils.service';
import { PromoService } from 'src/app/resources/services/promo.service';
import { Promo } from '../../resources/models/promo';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage implements OnInit {
  public promos: Promo[];

  constructor(
    private router: Router,
    private promoService: PromoService,
    public utilsService: UtilsService,
  ) {
    /* for (let index = 1; index < 16; index++) {
      this.promoService.add({
        address: 'address' + index,
        category: 'category' + index,
        createdAt: new Date(2022, 4, 16, index, index, index),
        createdBy: 'createdBy' + index,
        photo: 'photo' + index,
        price: index,
        product: 'product' + index,
        status: PromoStatus.active,
        store: 'store' + index,
      }).subscribe();
    } */

    this.promoService.getOrderByLimit('createdAt', 5, 'desc').pipe(take(1)).subscribe(promos => this.promos = [...promos]);
  }

  ngOnInit(): void {
  }

  loadData(event): void {
    setTimeout(() => {
      this.promoService.getOrderByStartAfterLimit('createdAt', this.promos[this.promos.length - 1].createdAt, 5, 'desc')
        .pipe(
          take(1)
        ).subscribe(promos => {
          this.promos.push(...promos);
          event.target.complete();
        });
    }, 500);
  }

  navigateToPromo(promo: Promo): void {
    this.router.navigate(['promos', promo.uid]);
  }

}
