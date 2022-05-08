import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { AuthenticationService } from '@services/authentication.service';
import { UsersService } from '@services/users.service';
import { UtilsService } from '@utils/utils.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  userProfile$ = this.usersService.currentUserProfile$;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private usersService: UsersService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void { }

  logout() {
    this.authService.logout().pipe(
      finalize(() => this.utilsService.setLoading(false))
    ).subscribe(() => {
      FacebookLogin.logout();
      this.router.navigate(['']);
    });
  }
}
