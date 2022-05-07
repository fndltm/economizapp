import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential
} from '@angular/fire/auth';
import { FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { User } from '@codetrix-studio/capacitor-google-auth';
import { UtilsService } from '@utils/utils.service';
import { EmailAuthProvider, FacebookAuthProvider, fetchSignInMethodsForEmail, signInWithCredential } from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

  loginWithGoogle(user: User): Observable<UserCredential> {
    return from(signInWithCredential(
      this.auth,
      GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken)
    )).pipe(
      take(1)
    );
  }

  loginWithFacebook(facebookRes: FacebookLoginResponse): Promise<UserCredential | void> {
    let existingEmail = null;

    const facebookCredential = FacebookAuthProvider.credential(facebookRes.accessToken.token);

    return signInWithCredential(
      this.auth,
      facebookCredential
    )
      .then(res => res)
      .catch(err => {
        // eslint-disable-next-line eqeqeq
        if (err.code == 'auth/account-exists-with-different-credential') {
          existingEmail = err.customData.email;
          return fetchSignInMethodsForEmail(this.auth, existingEmail)
            .then(providers => {
              if (providers.indexOf(EmailAuthProvider.PROVIDER_ID) !== -1) {
                // Password account already exists with the same email.
                // Ask user to provide password associated with that account.
                const password = window.prompt('Por favor, entre com a senha para o e-mail: ' + existingEmail);
                return signInWithEmailAndPassword(this.auth, existingEmail, password)
                  .then((result) => result.user);
              } else if (providers.indexOf(GoogleAuthProvider.PROVIDER_ID) !== -1) {
                const googProvider = new GoogleAuthProvider();
                // Sign in user to Google with same account.
                // eslint-disable-next-line @typescript-eslint/naming-convention
                googProvider.setCustomParameters({ login_hint: existingEmail });
                return signInWithPopup(this.auth, googProvider)
                  .then((result) => result.user);
              } else {
                return signInWithPopup(this.auth, new FacebookAuthProvider())
                  .then((result) => result.user);
              }
            }).then((user) => {
              linkWithCredential(user, facebookCredential);
            });
        }
        return null;
      });
  }

  logout(): Observable<void> {
    this.utilsService.setLoading(true);
    return from(this.auth.signOut());
  }
}
