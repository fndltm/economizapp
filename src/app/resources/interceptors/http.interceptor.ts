import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '@utils/utils.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
