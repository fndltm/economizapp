import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'firebase/auth';
import { concatMap, finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/resources/services/authentication.service';
import { ImageUploadService } from 'src/app/resources/services/image-upload.service';
import { UsersService } from 'src/app/resources/services/users.service';
import { UtilsService } from 'src/app/resources/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user$ = this.authService.currentUser$;
  userProfile$ = this.usersService.currentUserProfile$;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private usersService: UsersService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().pipe(
      finalize(() => this.utilsService.setLoading(false))
    ).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  uploadImage(event: any, user: User) {
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe({
        success: 'Upload com sucesso!',
        loading: 'Fazendo upload da imagem...',
        error: 'Houve um erro ao fazer upload da imagem!'
      }),
      concatMap((photoURL) => this.authService.updateProfileData({ photoURL })),
      finalize(() => this.utilsService.setLoading(false))
    ).subscribe();
  }
}
