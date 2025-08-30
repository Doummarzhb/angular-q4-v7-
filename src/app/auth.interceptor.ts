import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authToken = 'your api key ';

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${this.authToken}`
    }
  });

  return next.handle(authReq);
}
}
