import { Component } from '@angular/core';
import { AuthenticationService } from './resources/services/authentication.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(public authService: AuthenticationService) { }
}
