/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '@services/authentication.service';
import { UsersService } from '@services/users.service';
import { UtilsService } from '@utils/utils.service';
import { finalize, switchMap, take } from 'rxjs/operators';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;

  form = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: passwordsMatchValidator() });

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private usersService: UsersService,
    private toast: HotToastService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    const { displayName, email, password } = this.form.value;
    this.authService
      .signUp(email, password)
      .pipe(
        take(1),
        switchMap(({ user: { uid } }) =>
          this.usersService.addUser({ uid, email, displayName })
        ),
        this.toast.observe({
          success: 'Cadastrado com sucesso!',
          loading: 'Carregando...',
          error: ({ message }) => message
        }),
        finalize(() => this.utilsService.setLoading(false))
      ).subscribe(() => this.router.navigate(['']));
  }

}
