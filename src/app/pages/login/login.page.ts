import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '@services/authentication.service';
import { UtilsService } from '@utils/utils.service';
import { finalize, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from } from 'rxjs';

import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthenticationService,
    private toast: HotToastService,
    public utilsService: UtilsService,
    private router: Router
  ) {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const { email, password } = this.form.value;
    this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Logado com sucesso',
        loading: 'Carregando...',
        error: 'Login ou senha inválidos!'
      }),
      finalize(() => {
        this.utilsService.setLoading(false);
      })
    ).subscribe(() => this.router.navigate(['']));
  }

  async loginWithGoogle() {
    const user = await GoogleAuth.signIn();
    console.log('user: ', user);
    console.log('user email: ', user.email);
    console.log('user family name: ', user.familyName);
  }

  loginWithFacebook(): void {
    FacebookLogin.initialize({ appId: '745085980004248' });

    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
    const result = from(FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }));

    result.pipe(
      take(1)
    ).subscribe(res => {
      if (res.accessToken) {
        // Login successful.
        console.log(`Facebook userId is ${res.accessToken.userId}`);
      }
    });
  }
}
