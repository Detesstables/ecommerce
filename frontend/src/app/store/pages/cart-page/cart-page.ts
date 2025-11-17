import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { OrdersService } from '../../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../../shared/services/cart.service'; 


@Component({
  selector: 'app-cart-page',
  standalone: true,
  // Agregamos CurrencyPipe ya que tu HTML lo usa
  imports: [CommonModule, RouterLink, FontAwesomeModule], 
  templateUrl: './cart-page.html', // Renombrado de .component.html a .html
  styleUrls: ['./cart-page.css'] 
})
// --- CLASE RENOMBRADA A LA CONVENCIÓN CORTA ---
export class CartPage implements OnInit { 
  faShoppingCart = faShoppingCart;
  isLoading = false;
  
  public cartItems$: Observable<CartItem[]>; 
  
  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private cartService: CartService 
  ) { 
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    // Initialization code if needed
  }

  get cartTotal(): number {
    // Calculates total from the latest snapshot of the service
    return this.cartService.getCartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  removeItem(productId: number): void {
      this.cartService.removeItem(productId);
      this.toastr.info('Producto eliminado del carrito.', 'Carrito');
  }

  /**
   * Dispara la transacción atómica en el backend (el Procedimiento Almacenado).
   */
  processTransaction(): void {
    const currentItems = this.cartService.getCartItems();

    if (currentItems.length === 0) {
      this.toastr.warning('El carrito está vacío.', 'Atención');
      return;
    }
    
    this.isLoading = true;
    
    // Tomamos el primer item para simular la compra y probar el SP.
    const firstItem = currentItems[0];
    
    this.ordersService.createOrder(firstItem.id, firstItem.quantity).subscribe({
      next: (response) => {
        this.toastr.success(response.message, '¡Transacción Exitosa!');
        this.isLoading = false;
        this.cartService.clearCart(); 
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al procesar la compra. Revisa la base de datos.';
        this.toastr.error(errorMessage, 'Error de Transacción');
        this.isLoading = false;
        console.error('Error de servicio:', err);
      }
    });
  }
}