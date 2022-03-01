/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  public get isLoading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  public setLoading(value: boolean) {
    this._loading.next(value);
  }

  public isFieldInvalid(form: FormGroup, field: string): boolean {
    return !form.get(field)?.valid && form.get(field)?.touched;
  }
}
