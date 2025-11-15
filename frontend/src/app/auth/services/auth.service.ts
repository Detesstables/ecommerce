import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs'; // <-- Importa BehaviorSubject
import { jwtDecode } from 'jwt-decode'; //para ver que roles hay loco

const API_URL = 'http://localhost:3000';

interface JwtPayload {
  sub: number;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
  nombre: string; 
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject guarda el último valor emitido.
  // Inicia como 'null' (nadie logueado).
  private userSubject = new BehaviorSubject<JwtPayload | null>(null);
  
  // Hacemos pública la 'versión observable' (solo de lectura)
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Carga el estado al iniciar el servicio
    this.init();
  }

  // --- Revisa el localStorage al cargar la app ---
  private init(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        // (Aquí deberíamos validar la expiración, pero lo omitimos por simplicidad)
        this.userSubject.next(payload); // Carga al usuario
      } catch (error) {
        // Token inválido
        this.logout();
      }
    }
  }

  register(data: any): Observable<any> {
    const body = {
      nombre: data.nombre,
      email: data.email,
      contraseña: data.contraseña,
      direccion: data.direccion,
      rol: 'CLIENTE',
      numero: data.numero
    };
    return this.http.post<any>(`${API_URL}/users/register`, body);
  }

  login(email: string, contrasena: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${API_URL}/auth/login`, {
      email: email,
      contraseña: contrasena
    }).pipe(
      tap(response => {
        this.saveSession(response.accessToken);
      })
    );
  }

  private saveSession(token: string): void {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userRole', payload.rol); 
      
      this.userSubject.next(payload); 

    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    
    this.userSubject.next(null); 
  }

  // (isAuthenticated y getUserRole ya no son necesarios
  // en el Navbar, pero los dejamos por si los 'Guards' los usan)

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
  public getUserRole(): 'ADMIN' | 'CLIENTE' | null {
    return localStorage.getItem('userRole') as 'ADMIN' | 'CLIENTE' | null;
  }
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}