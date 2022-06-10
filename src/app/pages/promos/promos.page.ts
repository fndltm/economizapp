import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UtilsService } from '@utils/utils.service';
import { PromoService } from 'src/app/resources/services/promo.service';
import { Promo } from '../../resources/models/promo';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage {
  public promos: Promo[];

  constructor(
    private alertController: AlertController,
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
  }

  ionViewDidEnter(): void {
    this.promoService.getOrderByLimit('createdAt', 5, 'desc').pipe(take(1)).subscribe(promos => {
      this.promos = [...promos];
      this.utilsService.setLoading(false);
    });
  }

  doRefresh(event): void {
    this.promoService.getOrderByLimit('createdAt', 5, 'desc').pipe(take(1)).subscribe(promos => {
      this.promos = [...promos];
      event.target.complete();
      this.utilsService.setLoading(false);
    });
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

  async presentDeleteAlert(promo: Promo): Promise<void> {
    const alert = await this.alertController.create({
      message: `Tem certeza que desejar excluir o item ${promo.product}?`,
      header: 'Confirma a exclusão?',
      buttons: [
        'Cancelar',
        {
          text: 'Deletar',
          handler: () => {
            this.deletePromo(promo);
          }
        }
      ]
    });

    alert.present();
  }


  deletePromo(promo: Promo): void {
    this.promoService.delete(promo.uid).pipe(
      take(1)
    ).subscribe(() => {
      this.ionViewDidEnter();
      this.utilsService.presentSuccessToast('Deletado com sucesso!');
    });
  }

}
