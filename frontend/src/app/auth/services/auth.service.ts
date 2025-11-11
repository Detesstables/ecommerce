// frontend/src/app/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, contrasena: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${API_URL}/auth/login`, {
      email: email,
      contraseña: contrasena
    }).pipe(
      tap(response => {
        this.saveToken(response.accessToken);
      })
    );
  }

  private saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }
}