import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.getPromos();
  }

  ngOnInit() {
    console.log(this.promos)
  }

  getPromos() {
    this.promos = [
      {
        uid: '5f16d554',
        product: 'Chocolate Kit Kat ao Leite 41,5g',
        store: 'Lojas Americanas - Via Shopping',
        price: 0.90,
        address: 'BH Shopping, BR-356, 3049 - Belvedere, Belo Horizonte - MG, 30320-900',
        category: 'Alimentação',
        likes: 5,
        createdAt: '2015-03-25T12:00:00Z',
        createdBy: 'Raywam Shinkoda',
        active: true,
        comments: [{
          uid: 'osdsdsd3323',
          firstName: 'Ana',
          lastName: 'Silva',
          comment: 'Obrigada por compartilhar a promoção.',
          createdAt: '2015-03-25T12:00:00Z',
          likes: 5
        },
        {
          uid: 'osdsdsd3323',
          firstName: 'Ricardo',
          lastName: 'Soares',
          comment: 'A promoção acabou.',
          createdAt: '2015-03-25T12:00:00Z',
          likes: 5
        }]
      },
      {
        uid: '5fddd554',
        product: 'Leite Condensado Piracanjuba 395g',
        store: 'Supermercado BH - Via Shopping',
        price: 1.89,
        address: 'BH Shopping, BR-356, 3049 - Belvedere, Belo Horizonte - MG, 30320-900',
        category: 'Alimentação',
        likes: 4,
        createdAt: '2022-03-25T12:00:00Z',
        createdBy: 'Raywam Shinkoda',
        active: true
      },
      {
        uid: '5fddd554',
        product: 'Máscara Cirúrgica Descartável Protectme 50 unidades',
        store: 'Droga Raia - Barreiro',
        price: 15.89,
        address: 'BH Shopping, BR-356, 3049 - Belvedere, Belo Horizonte - MG, 30320-900',
        category: 'Alimentação',
        likes: 3,
        observation: 'O produto está na frente do caixa 3. Aparentemente não vão repor.',
        createdAt: '2022-03-30T13:00:00Z',
        createdBy: 'Raywam Shinkoda',
        active: true
      }
    ]
  }

  public formatDate(date) {
    return formatDate(date, 'dd/MM/yyyy', 'en-US')
  }

  goToPromo(promo) {
    this.promoService.setPromo(promo)
    this.router.navigate(['/promo'])
  }

}
