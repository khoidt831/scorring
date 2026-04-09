import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private baseUrl = environment.apiUrl;

  private TOKEN_KEY = 'token';
  private REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  loginApi(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authentication/token`, {
      username,
      password
    }).pipe(
      tap(res => {
        const token = res.data?.accessToken;
        if (token) {
          this.setSession(token);
        } else {
          throw new Error('No accessToken in response');
        }
      })
    );
  }

  private setSession(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return !this.isTokenExpired(token, 5);
  }

  private isTokenExpired(token: string, bufferSeconds: number = 0): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.exp * 1000) - (bufferSeconds * 1000) < Date.now();
    } catch {
      return true;
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<any>(`${this.baseUrl}/refresh`, {
      refreshToken
    }).pipe(
      tap(res => {
        const token = res.data?.accessToken;
        this.setSession(token);
      })
    );
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRoles(): string[] {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role) return [];
    return [user.role];
  }
  
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  shouldRefreshToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return this.isTokenExpired(token, 30);
  }

  getProfile(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/login`, {
      username,
      password
    });
  }

}