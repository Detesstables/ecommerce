import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service'; 

// Usamos la URL base de tu backend
const API_URL = 'http://localhost:3000'; 

@Injectable({
  providedIn: 'root'
})
export class OrdersService { 

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  /**
   * Llama al endpoint de transacción del backend (POST /orders/:id)
   * que ejecuta el Procedimiento Almacenado de PostgreSQL.
   * * @param productId ID del producto a comprar.
   * @param quantity Cantidad a comprar.
   */
  createOrder(productId: number, quantity: number): Observable<any> {
    
    // Obtenemos el token para la autenticación (necesario por el @UseGuards en NestJS)
    const token = this.authService.getToken(); 
    
    // Si no hay token, lanzamos un error o redirigimos (aunque el guard de NestJS también lo haría)
    if (!token) {
        throw new Error("User not authenticated.");
    }
    
    // Creamos los Headers con el Bearer Token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Usamos el endpoint POST /orders/:id que preparamos en NestJS
    return this.http.post<any>(
      `${API_URL}/orders/${productId}`, // POST /orders/123
      { quantity: quantity }, // Pasamos la cantidad en el body
      { headers: headers }
    );
  }
}