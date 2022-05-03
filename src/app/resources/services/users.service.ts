import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UtilsService } from '@utils/utils.service';
import { Observable, of, from } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { UserProfile } from '@models/user-profile';
import { AuthenticationService } from './authentication.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<UserProfile> {
  constructor(
    public firestore: Firestore,
    private authService: AuthenticationService,
    private utilsService: UtilsService
  ) {
    super(firestore, 'users');
  }

  get currentUserProfile$(): Observable<UserProfile | null> {
    this.utilsService.setLoading(true);
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          this.utilsService.setLoading(false);
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user.uid);
        this.utilsService.setLoading(false);
        return docData(ref) as Observable<UserProfile>;
      }),
      finalize(() => this.utilsService.setLoading(false))
    );
  }

  addUser(user: UserProfile): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: UserProfile): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
