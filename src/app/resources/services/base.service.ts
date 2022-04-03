import { Inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { docData } from 'rxfire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends { uid?: string }> {

  constructor(public firestore: Firestore, @Inject(String) public collectionName: string) { }

  get(): Observable<T[]> {
    return collectionData(collection(this.firestore, this.collectionName)) as Observable<T[]>;
  }

  getByUid(uid: string): Observable<T | null> {
    return docData(doc(this.firestore, this.collectionName, uid)) as Observable<T>;
  }

  add(data: T): Observable<void> {
    return from(
      setDoc(
        doc(this.firestore, this.collectionName, data.uid),
        data
      )
    );
  }

  update(data: T): Observable<void> {
    return from(
      updateDoc(
        doc(this.firestore, this.collectionName, data.uid),
        { ...data }
      )
    );
  }

  delete(uid: string): void {
    collection(this.firestore, this.collectionName, uid);
  }
}
