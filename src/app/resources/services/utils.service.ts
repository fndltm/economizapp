import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public isFieldInvalid(form: FormGroup, field: string): boolean {
    return !form.get(field)?.valid && form.get(field)?.touched;
  }
}
