
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private buildUrl(url: string) {
    return `${this.baseUrl}/${url.replace(/^\/+/, '')}`;
  }

  get<T>(url: string) {
    return this.http.get<T>(this.buildUrl(url));
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(this.buildUrl(url), body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(this.buildUrl(url), body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(this.buildUrl(url));
  }
}
