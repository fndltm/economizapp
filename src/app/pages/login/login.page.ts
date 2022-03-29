import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/resources/services/authentication.service';
import { UtilsService } from 'src/app/resources/services/utils.service';

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
    private router: Router,
    private authService: AuthenticationService,
    private toast: HotToastService,
    public utilsService: UtilsService
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
        loading: 'Carregando...',
        error: 'Login ou senha inválidos!'
      }),
      finalize(() => {
        this.toast.close();
        this.utilsService.setLoading(false);
      })
    ).subscribe(() => this.router.navigate(['/promos']));
  }
}
