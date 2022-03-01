import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  UserInfo
} from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { from, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth, private utilsService: UtilsService) { }

  signUp(email: string, password: string): Observable<UserCredential> {
    this.utilsService.setLoading(true);
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(username: string, password: string): Observable<UserCredential> {
    this.utilsService.setLoading(true);
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    this.utilsService.setLoading(true);
    const currentUser = this.auth.currentUser;
    return of(currentUser).pipe(
      concatMap((user) => {
        if (!user) { throw new Error('Não está autenticado!'); }

        return updateProfile(user, profileData);
      })
    );
  }

  logout(): Observable<void> {
    this.utilsService.setLoading(true);
    return from(this.auth.signOut());
  }
}
