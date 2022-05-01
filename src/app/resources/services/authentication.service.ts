import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from '@angular/fire/auth';
import { UtilsService } from '@utils/utils.service';
import { authState } from 'rxfire/auth';
import { from, Observable } from 'rxjs';

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

  login(email: string, password: string): Observable<UserCredential> {
    this.utilsService.setLoading(true);
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    this.utilsService.setLoading(true);
    return from(this.auth.signOut());
  }
}
