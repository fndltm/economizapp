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
  public chipSelected: string = '';
  public noResults : boolean = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private promoService: PromoService,
    private usersService: UsersService,
    public utilsService: UtilsService,
  ) { }

  ionViewDidEnter(): void {
    this.chips.forEach(c => c.selected = false);

    this.promoService.getOrderByLimit('createdAt', 5, 'desc').pipe(take(1)).subscribe(promos => {
      if (promos.length > 0) {
        this.promos = [...promos];
        this.noResults = false;
        this.utilsService.setLoading(false);
      } else {
        this.promos = [];
        this.noResults = true;
      }
    });
  }

  doRefresh(event): void {
    this.promoService.getOrderByLimit('createdAt', 5, 'desc').pipe(take(1)).subscribe(promos => {
      if (promos.length > 0) {
        this.noResults = false;
        this.promos = [...promos];
        event.target.complete();
        this.utilsService.setLoading(false);
      } else {
        this.promos = [];
        this.noResults = true;
      }
    });
  }

  loadData(event): void {
    if (this.promos.length > 0) {
      setTimeout(() => {
        this.promoService.getOrderByStartAfterLimit('createdAt', this.promos[this.promos.length - 1].createdAt, 5, 'desc')
          .pipe(
            take(1)
          ).subscribe(promos => {
            if (promos.length > 0) {
              this.promos.push(...promos);
              this.noResults = false;
              event.target.complete();
            } else {
              this.promos = [];
              this.noResults = true;
            }
          });
      }, 500);
    } else {
      event.target.complete();
    }
  }

  selectChip(chip: Chip): void {
    if (chip.selected) {
      this.chipSelected = '';
      this.chips.forEach(c => c.selected = false);
      this.ionViewDidEnter();
    } else {
      this.chipSelected = chip.label;
      this.chips.forEach(c => c.selected = false);
      chip.selected = true;
      this.promoService.getOrderByLimitCategory('createdAt', 5, chip, 'desc').pipe(take(1)).subscribe(promos => {
        if (promos.length > 0) {
          this.promos = [...promos];
          this.utilsService.setLoading(false);
        } else {
          this.promos = [];
          this.noResults = true;
        }
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
