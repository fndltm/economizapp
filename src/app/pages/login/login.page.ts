import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthenticationService } from 'src/app/resources/services/authentication.service';
import { ToastService } from 'src/app/resources/services/toast.service';
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
    private toastService: ToastService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe(
      res => {
        this.router.navigate(['/home']);
      },
      error => {
        this.toastService.showErrorToast('Email ou senha incorretos!');
      }
    );
  }
}
