import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz que representa un ítem en el carrito
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  // Usamos BehaviorSubject para que cualquier componente pueda suscribirse y
  // obtener el estado actual del carrito (reactividad).
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Observable público para que los componentes se suscriban
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  /**
   * Obtiene la lista actual de ítems del carrito.
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  /**
   * Añade un producto al carrito o incrementa su cantidad.
   */
  addItem(product: { id: number, nombre: string, precio: number, stock: number }): void {
    const currentItems = this.getCartItems();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      // Si ya existe, incrementa la cantidad (si hay stock)
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      }
    } else {
      // Si es un producto nuevo, añádelo
      const newItem: CartItem = {
        id: product.id,
        name: product.nombre,
        price: product.precio,
        quantity: 1,
        stock: product.stock
      };
      currentItems.push(newItem);
    }
    
    // Emite el nuevo estado del carrito
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