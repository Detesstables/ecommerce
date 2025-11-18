import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs'; 
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000';
const TOKEN_KEY = 'access_token'; // <-- Usamos solo esta clave

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
	
	private userSubject = new BehaviorSubject<JwtPayload | null>(null);
	public currentUser$ = this.userSubject.asObservable();

	constructor(private http: HttpClient) {
		this.init();
	}

	private init(): void {
		const token = this.getToken();
		if (token) {
			try {
				const payload = jwtDecode<JwtPayload>(token);
				this.userSubject.next(payload); 
			} catch (error) {
				this.logout();
			}
		}
	}

	register(data: any): Observable<any> {
		return this.http.post<any>(`${API_URL}/users/register`, data);
	}

	login(email: string, contrasena: string): Observable<{ accessToken: string }> {
		return this.http.post<{ accessToken: string }>(`${API_URL}/auth/login`, {
			email: email,
			contraseña: contrasena
		}).pipe(
			tap(response => {
				// --- CORRECCIÓN CLAVE ---
				// 1. NestJS envía el token en una propiedad llamada 'access_token' (asumo)
				this.saveSession(response.accessToken); 
			})
		);
	}

	private saveSession(token: string): void {
		try {
			const payload = jwtDecode<JwtPayload>(token);
			// Guardamos solo el token
			localStorage.setItem(TOKEN_KEY, token); 
			
			// Actualizamos el Subject con el payload decodificado
			this.userSubject.next(payload); 
		} catch (error) {
			console.error('Error al decodificar o guardar el token', error);
			this.logout();
		}
	}

	logout(): void {
		// Eliminamos solo la clave única del token
		localStorage.removeItem(TOKEN_KEY);
		this.userSubject.next(null); 
	}

	// MÉTODOS CLAVE PARA LOS GUARDS DE ANGULAR Y EL JWT BEARER TOKEN
	
	public isAuthenticated(): boolean {
		return !!this.getToken();
	}
	
	public getUserRole(): 'ADMIN' | 'CLIENTE' | null {
		return this.userSubject.getValue()?.rol || null;
	}
	
	public getToken(): string | null {
		// Lee el token de la clave única
		return localStorage.getItem(TOKEN_KEY);
	}
}