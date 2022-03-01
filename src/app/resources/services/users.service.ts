import { Injectable } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ProfileUser } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthenticationService, private utilsService: UtilsService) { }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    this.utilsService.setLoading(true);
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        this.utilsService.setLoading(false);

        return docData(ref) as Observable<ProfileUser>;
      }),
      finalize(() => this.utilsService.setLoading(false))
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    this.utilsService.setLoading(true);
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    this.utilsService.setLoading(true);
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
