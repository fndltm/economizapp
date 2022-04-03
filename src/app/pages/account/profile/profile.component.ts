import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from '@models/user-profile';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '@services/authentication.service';
import { ImageUploadService } from '@services/image-upload.service';
import { UsersService } from '@services/users.service';
import { UtilsService } from '@utils/utils.service';
import { switchMap, finalize, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    displayName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  });

  constructor(
    private usersService: UsersService,
    private toast: HotToastService,
    private imageUploadService: ImageUploadService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.usersService.currentUserProfile$.subscribe((user) => {
      this.form.patchValue({ ...user });
    });
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    this.usersService
      .update(this.form.value)
      .pipe(
        this.toast.observe({
          success: 'Salvo com sucesso!',
          loading: 'Carregando...',
          error: ({ message }) => message
        }),
        finalize(() => this.utilsService.setLoading(false))
      ).subscribe();
  }

  uploadImage(event: any, { uid }: UserProfile) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          success: 'Upload com sucesso!',
          loading: 'Fazendo upload da imagem...',
          error: 'Houve um erro ao fazer upload da imagem!'
        }),
        switchMap((photoURL) =>
          this.usersService.update({ uid, photoURL })
        ),
        finalize(() => this.utilsService.setLoading(false))
      )
      .subscribe();
  }
}
