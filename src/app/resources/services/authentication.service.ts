import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) { }

  login(username: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}
