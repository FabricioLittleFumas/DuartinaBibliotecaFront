import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token-service';
import { AuthService } from '../auth-service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.accessToken;
    if (token && !req.url.includes('/autentica/')) req = this.addToken(req, token);
    return next.handle(req).pipe(catchError(error => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) return throwError(() => error);
      if (req.url.includes('/autentica/refresh')) { this.tokenService.clearTokens(); this.authService.notificarLogout(); this.router.navigate(['/home']); return throwError(() => error); }
      if (!this.tokenService.accessToken || !this.tokenService.refreshToken) return throwError(() => error);
      return this.handle401Error(req, next);
    }));
  }
  private handle401Error(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.tokenService.isRefreshingToken) {
      this.tokenService.isRefreshingToken = true; this.refreshTokenSubject.next(null);
      return this.tokenService.refreshAccessToken().pipe(switchMap(tokens => { this.tokenService.isRefreshingToken=false; this.refreshTokenSubject.next(tokens.accessToken); this.authService.notificarLogin(); return next.handle(this.addToken(req,tokens.accessToken)); }),catchError(error => { this.tokenService.isRefreshingToken=false; this.tokenService.clearTokens(); this.authService.notificarLogout(); this.router.navigate(['/home']); return throwError(() => error); }));
    }
    return this.refreshTokenSubject.pipe(filter((value): value is string => value !== null),take(1),switchMap(value=>next.handle(this.addToken(req,value))));
  }
  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> { return req.clone({setHeaders:{Authorization:`Bearer ${token}`}}); }
}
