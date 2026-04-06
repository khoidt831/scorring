import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

   
    const isAuthApi =
      req.url.includes('/authentication/token') ||
      req.url.includes('/refresh');

    if (isAuthApi) {
      return next.handle(req);
    }


    const token = this.authService.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // Nếu 401 → xử lý refresh token
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;

          const newToken = res.data?.accessToken;


          if (!newToken) {
            this.authService.logout();
            return throwError(() => new Error('No token from refresh'));
          }

          this.authService.saveToken(newToken);
          this.refreshTokenSubject.next(newToken);

  
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            })
          );
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token =>
        next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          })
        )
      )
    );
  }
}