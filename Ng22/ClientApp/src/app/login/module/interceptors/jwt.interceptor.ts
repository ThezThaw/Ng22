import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    var token;
    if (request.url.includes('/l2')) {
      token = localStorage.getItem('token-l2');



    } else {
      token = localStorage.getItem('token');
    }
      

    
    //const isApiUrl = request.url.startsWith(request.url);
    //if (appToken && isApiUrl) {      
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(request);
  }
}
