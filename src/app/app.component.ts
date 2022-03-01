import { Component } from '@angular/core';
import { UtilsService } from './resources/services/utils.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoading = false;

  constructor(public utilsService: UtilsService) {
    this.utilsService.isLoading.subscribe(loading => this.isLoading = loading);
  }
}
