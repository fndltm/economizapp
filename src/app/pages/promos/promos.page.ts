import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UtilsService } from '@utils/utils.service';
import { PromoService } from 'src/app/resources/services/promo.service';
import { Promo } from '../../resources/models/promo';
import { AlertController } from '@ionic/angular';
import { Chip, CHIPS } from 'src/app/resources/constants/chip';
import { UsersService } from '@services/users.service';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.page.html',
  styleUrls: ['./promos.page.scss'],
})
export class PromosPage {
  userProfile$ = this.usersService.currentUserProfile$;
  public promos: Promo[];

  public chips = CHIPS;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private promoService: PromoService,
    private usersService: UsersService,
    public utilsService: UtilsService,
  ) { }

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

  selectChip(chip: Chip): void {
    if (chip.selected) {
      this.chips.forEach(c => c.selected = false);
      this.ionViewDidEnter();
    } else {
      this.chips.forEach(c => c.selected = false);
      chip.selected = true;
      this.promoService.getOrderByLimitCategory('createdAt', 5, chip, 'desc').pipe(take(1)).subscribe(promos => {
        this.promos = [...promos];
        this.utilsService.setLoading(false);
      });
    }
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
