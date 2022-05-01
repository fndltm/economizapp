/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public currencyOptions = { prefix: 'R$ ', thousands: '.', decimal: ',' };

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private toastController: ToastController) { }

  public get isLoading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  public setLoading(value: boolean) {
    this._loading.next(value);
  }

  public isFieldInvalid(form: FormGroup, field: string): boolean {
    return form.get(field)?.invalid && form.get(field)?.touched;
  }

  public async presentErrorToast(message: string = 'Ocorreu um erro!'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      icon: 'close-circle-outline',
      color: 'danger',
      cssClass: 'text-white'
    });

    toast.present();
  }

  public async presentSuccessToast(message: string = 'Salvo com sucesso!'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      icon: 'checkmark-circle-outline',
      color: 'success',
      cssClass: 'text-white'
    });

    toast.present();
  }
}
