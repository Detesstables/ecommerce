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

interface PedidoPersonalizadoResponse {
    id: number;
    titulo: string;
    presupuesto_final: number;
    producto_id: number; // El FK al producto temporal
    estado: string;
    observacion_admin: string | null;
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

    getQuotationDetails(requestId: number): Observable<PedidoPersonalizadoResponse> {
        const token = this.authService.getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        // Llama al endpoint GET para obtener un solo registro
        return this.http.get<PedidoPersonalizadoResponse>(
            `${API_URL}/personalizados/${requestId}`, 
            { headers: headers }
        );
    }

comprarPedido(id: number) {
  const token = this.authService.getToken();
  const headers = { 'Authorization': `Bearer ${token}` };

  return this.http.post(`${API_URL}/personalizados/comprar/${id}`, {}, { headers });
}

}