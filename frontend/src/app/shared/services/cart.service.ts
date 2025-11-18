import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz que representa un ítem en el carrito
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  // --- ¡CAMBIO CLAVE 1: Añadir imageUrl! ---
  imageUrl?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  /**
   * Añade un producto al carrito o incrementa su cantidad.
   */
  addItem(product: { id: number, nombre: string, precio: number, stock: number, imageUrl?: string }): void {
    const currentItems = this.getCartItems();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      }
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        stock: product.stock,
        // --- ¡CAMBIO CLAVE 2: Guardar la URL! ---
        imageUrl: product.imageUrl 
      };
      currentItems.push(newItem);
    }
    
    this.cartItemsSubject.next(currentItems);
  }

  /**
   * Elimina un ítem del carrito por completo.
   */
  removeItem(productId: number): void {
    const updatedItems = this.getCartItems().filter(item => item.id !== productId);
    this.cartItemsSubject.next(updatedItems);
  }

  /**
   * Vacía todo el carrito después de una compra exitosa.
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}