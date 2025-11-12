import { Component, OnInit } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common'; // Ya no necesitamos NgClass/FormsModule
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductService, Producto } from '../../services/product.service'; 
import { CategoryService, Categoria } from '../../services/category.service'; 
import { OrderService } from '../../services/order.service'; 
import { AuthService } from '../../../auth/services/auth.service';
import { ProductCard } from '../../../shared/components/product-card/product-card'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faArrowLeft, faBook, faPenFancy, faStickyNote, faClipboardList } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    ProductCard,
    LowerCasePipe,
    FontAwesomeModule
  ],
  templateUrl: './category-page.html',
})
export class CategoryPage implements OnInit {

  public productos: Producto[] = [];
  public categoria: Categoria | null = null;
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  public backendUrl = 'http://localhost:3000'; 

  // Iconos
  faArrowLeft = faArrowLeft;
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  this.route.paramMap.pipe(


    switchMap(params => {
      const id = Number(params.get('id'));
      if (!id) {
        throw new Error('ID de categoría no válido');
      }
      this.isLoading = true;
      this.errorMessage = null;
      return this.categoryService.getCategories(); 
    }),

    switchMap((categorias: Categoria[]) => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.categoria = categorias.find(c => c.id === id) || null;
      return this.productService.getProductos({ categoria_id: id });
    })

  ).subscribe({
    next: (productos) => {
      this.productos = productos;
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Error al cargar los productos de esta categoría.';
      this.isLoading = false;
    }
  });
}

  // Mapeo de iconos para dar un toque visual (Mantenemos esto del diseño anterior)

  // Lógica de compra (se mantiene igual)
  onComprarProducto(productoId: number): void {
    // ... (Tu lógica de compra actual) ...
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para comprar.');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.authService.getUserRole() !== 'CLIENTE') {
      alert('Los administradores no pueden realizar compras.');
      return;
    }

    this.orderService.comprarProducto(productoId).subscribe({
      next: (response) => {
        alert('¡Producto comprado con éxito!');
        // No deberías llamar a ngOnInit aquí, sino actualizar el estado local o usar un servicio de carrito.
        // Por ahora, lo mantenemos como estaba en tu código original.
        // this.ngOnInit(); 
      },
      error: (err) => {
        alert(`Error: ${err.error.message || 'No se pudo procesar la compra.'}`);
      }
    });
  }
}