import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { Producto } from '../../../store/services/product.service';
// Definimos la 'interfaz' para saber cómo es un Producto


@Component({
  selector: 'app-product-card',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard {

  @Input() producto!: Producto; 
  @Input() backendUrl: string = ''; 
  @Output() comprarClick = new EventEmitter<number>();

  constructor() { }

  // Formatea el precio
  formatPrice(precio: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  onComprar(): void {
    this.comprarClick.emit(this.producto.id);
  }
}