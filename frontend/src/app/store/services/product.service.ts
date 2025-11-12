import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

const API_URL = 'http://localhost:3000'; 

// (Tus interfaces Categoria y Producto)
export interface Categoria {
  id: number;
  nombre: string;
}
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string | null;
  categoria_id: number;
  categoria: Categoria;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // GET /productos
  getProductos(query?: any): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URL}/productos`, { params: query });
  }

  // DELETE /productos/:id
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/productos/${id}`, {
      headers: this.getAuthHeaders() 
    });
  }

  // POST /productos
  createProducto(formData: FormData): Observable<Producto> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    
    return this.http.post<Producto>(`${API_URL}/productos`, formData, {
      headers: headers 
    });
  }

  // --- ¡MÉTODO 'update' CORREGIDO! ---
  // (Asegúrate de que 'return' esté aquí)
  updateProducto(id: number, formData: FormData): Observable<Producto> {
    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // ¡'return' ES LA PALABRA CLAVE!
    return this.http.put<Producto>(`${API_URL}/productos/${id}`, formData, {
      headers: headers 
    });
  }
}