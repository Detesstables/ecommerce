import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000'; //  URL del backend

export interface Categoria {
  id: number;
  nombre: string;
  imagenUrl?: string | null;
  descripcion?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  // Llama a 'GET /categories' del backend
  getCategories(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${API_URL}/categories`);
  }
}
