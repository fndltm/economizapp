import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UtilsService } from '@utils/utils.service';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoading = false;
  isLoginPage;

  constructor(private splashScreen: SplashScreen, router: Router, public utilsService: UtilsService) {
    this.splashScreen.show();

    this.utilsService.isLoading.subscribe(loading => this.isLoading = loading);

    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.isLoginPage = val.url.includes('login');
      }
    });
  }
}
