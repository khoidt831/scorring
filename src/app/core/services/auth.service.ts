import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  private TOKEN_KEY = 'token';
  private REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  loginApi(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      username,
      password
    }).pipe(
      tap(res => this.setSession(res.token, res.refreshToken))
    );
  }

  private setSession(token: string, refreshToken?: string) {
    localStorage.setItem(this.TOKEN_KEY, token);

    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/auth/login']);
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

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {
      refreshToken
    }).pipe(
      tap(res => {
        this.setSession(res.token, res.refreshToken);
      })
    );
  }

  getUser(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      this.logout();
      return null;
    }
  }

  getRoles(): string[] {
    return this.getUser()?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  shouldRefreshToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return this.isTokenExpired(token, 30);
  }
}