import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class PersonalizedService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // --- FUNCIÓN 'createRequest' CORREGIDA ---
  // Acepta un objeto FormData, como lo necesita el backend.
  createRequest(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Llama al endpoint POST /personalizados
    return this.http.post<any>(`${API_URL}/personalizados`, formData, {
      headers: headers 
    });
  }
}