import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';


import { AuthService } from './auth/services/auth.service';
import { Observable } from 'rxjs';

import { CategoryService, Categoria } from './store/services/category.service';

// Define la interfaz del payload (lo que hay en el token)
interface JwtPayload {
  sub: number;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
  nombre: string;
}

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    FontAwesomeModule
  ], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit{
  

  public currentUser$: Observable<JwtPayload | null>;

  currentYear: number = new Date().getFullYear();
  faInstagram = faInstagram;
  isProductosDropdownOpen: boolean = false;
  isMobileMenuOpen: boolean = false;

  public categories$!: Observable<Categoria[]>;
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }
  
ngOnInit(): void {
    // Llama a la API para cargar las categorías al iniciar
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  // --- onLogout ---
  onLogout(): void {
    this.authService.logout(); // Llama al servicio
    this.closeAllMenus();
    this.router.navigate(['/auth/login']); // Redirige al login
  }

  // --- Lógica del Menú  ---
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProductosDropdownOpen = false;
    }
  }

  closeAllMenus(): void {
    this.isMobileMenuOpen = false;
    this.isProductosDropdownOpen = false;
  }

  toggleProductosDropdown(): void {
    this.isProductosDropdownOpen = !this.isProductosDropdownOpen;
    if (this.isProductosDropdownOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  closeProductosDropdown(): void {
    setTimeout(() => this.isProductosDropdownOpen = false, 150);
  }
}