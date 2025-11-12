import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

const API_URL = 'http://localhost:3000'; 

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  // Llama a POST /comprar/:id
  comprarProducto(productoId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${API_URL}/comprar/${productoId}`, {}, {
      headers: headers
    });
  }
}