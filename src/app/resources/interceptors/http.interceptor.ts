import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})

export class InterceptorService implements HttpInterceptor {

  constructor(
    public utilsService: UtilsService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.utilsService.setLoading(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.utilsService.setLoading(false);
      }),
    );
  }
}
