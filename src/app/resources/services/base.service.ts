import { Inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  limit,
  orderBy,
  OrderByDirection,
  query,
  startAfter,
  updateDoc
} from 'firebase/firestore';
import { docData } from 'rxfire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends { uid?: string }> {

  constructor(public firestore: Firestore, @Inject(String) public collectionName: string) { }

  get(): Observable<T[]> {
    return collectionData(collection(this.firestore, this.collectionName), { idField: 'uid' }) as Observable<T[]>;
  }

  getOrderByLimit(orderByName: string, limitNumber: number, direction: OrderByDirection = 'asc'): Observable<T[]> {
    return collectionData(
      query(collection(this.firestore, this.collectionName), orderBy(orderByName, direction), limit(limitNumber)), { idField: 'uid' }
    ) as Observable<T[]>;
  }

  getOrderByStartAfterLimit(
    orderByName: string,
    startAfterName: any,
    limitNumber: number,
    direction: OrderByDirection = 'asc'
  ): Observable<T[]> {
    return collectionData(
      query(
        collection(this.firestore, this.collectionName),
        orderBy(orderByName, direction), startAfter(startAfterName), limit(limitNumber)),
      { idField: 'uid' }
    ) as Observable<T[]>;
  }

  getByUid(uid: string): Observable<T | null> {
    return docData(doc(this.firestore, this.collectionName, uid), { idField: 'uid' }) as Observable<T>;
  }

  add(data: T): Observable<DocumentReference<DocumentData>> {
    return from(
      addDoc(
        collection(this.firestore, this.collectionName),
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

  delete(uid: string): Observable<void> {
    return from(
      deleteDoc(doc(this.firestore, this.collectionName, uid))
    );
  }
}
