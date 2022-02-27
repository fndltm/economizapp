import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  showSuccessToast(message: string, duration: number = 2000): void {
    const toast = from(this.toastController.create({
      message,
      duration,
      icon: 'checkmark-circle-outline',
      color: 'success',
      cssClass: 'text-white'
    }));
    toast.subscribe(t => t.present());
  }

  showErrorToast(message: string, duration: number = 2000): void {
    const toast = from(this.toastController.create({
      message,
      duration,
      icon: 'close-circle-outline',
      color: 'danger',
      cssClass: 'text-white'
    }));
    toast.subscribe(t => t.present());
  }

  showWarningToast(message: string, duration: number = 2000): void {
    const toast = from(this.toastController.create({
      message,
      duration,
      icon: 'alert-circle-outline',
      color: 'warning',
      cssClass: 'text-white'
    }));
    toast.subscribe(t => t.present());
  }
}
