import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '@services/authentication.service';
import { UtilsService } from '@utils/utils.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  ) { }

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
}
