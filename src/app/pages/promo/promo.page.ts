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
  constructor(
    private promoService: PromoService
  ) {
  }

  ngOnInit() {
  }

  public formatDate(date) {
    return formatDate(date, 'dd/MM/yyyy', 'pt-BR');
  }
}
