import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PromoService } from '@services/promo.service';
import { Promo } from '../../resources/models/promo';

@Component({
  selector: 'app-home',
  templateUrl: './promo.page.html',
  styleUrls: ['./promo.page.scss'],
})
export class PromoPage implements OnInit {
  public promo: Promo;

  constructor(
    private promoService: PromoService
  ) {
    console.log(this.promo);
  }

  ngOnInit() {
    this.promoObserve();
    console.log(this.promo);
  }

  promoObserve() {
    this.promoService.promo$.subscribe(res => this.promo = res);
  }

  public formatDate(date) {
    return formatDate(date, 'dd/MM/yyyy', 'pt-BR');
  }
}
