import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

const API_URL = 'http://localhost:3000';

interface UpdatePersonalizadoDto {
  estado: 'COTIZADO' | 'RECHAZADO' | 'PAGO_APROBADO' | 'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO';
  presupuesto_final?: number;
  observacion_admin?: string;
}

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

  getPendingRequests(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any[]>(`${API_URL}/personalizados/admin/pending`, {
      headers: headers
    });
  }

  updateStatus(id: number, dto: UpdatePersonalizadoDto): Observable<any> {
      const token = this.authService.getToken();
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Llama al endpoint PATCH /personalizados/admin/:id
      return this.http.patch(`${API_URL}/personalizados/admin/${id}`, dto, { headers });
    }
}