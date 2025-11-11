import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'frontend';

  // --- Lógica "Falsa" (Mock Data) ---
  isLoggedIn: boolean = false; 
  isAdmin: boolean = false;

  // --- Lógica para el Dropdown de Productos ---
  isProductosDropdownOpen: boolean = false;
  categoriasMock = [
    { id: 1, nombre: 'Cuadernos' },
    { id: 2, nombre: 'Lápices y Destacadores' },
    { id: 3, nombre: 'Planners' }
  ];

  // ---MENÚ RESPONSIVO---
  isMobileMenuOpen: boolean = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Cierra el dropdown de productos si abrimos el menú móvil
    if (this.isMobileMenuOpen) {
      this.isProductosDropdownOpen = false;
    }
  }

  // Cierra todos los menús (útil al hacer clic en un enlace)
  closeAllMenus(): void {
    this.isMobileMenuOpen = false;
    this.isProductosDropdownOpen = false;
  }
  // ---------------------------------------------

  toggleProductosDropdown(): void {
    this.isProductosDropdownOpen = !this.isProductosDropdownOpen;
    // Cierra el menú móvil si abrimos el de productos
    if (this.isProductosDropdownOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  closeProductosDropdown(): void {
    setTimeout(() => this.isProductosDropdownOpen = false, 150);
  }

  // --- Lógica de Auth ---
  onLogout(): void {
    console.log('¡El usuario hizo clic en Cerrar Sesión!');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.closeAllMenus(); // Cierra menús al desloguearse
  }
}