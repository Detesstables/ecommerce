import { Component, OnInit } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs/operators'; 
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; 

import { ProductService, Producto } from '../../services/product.service'; 
import { CategoryService, Categoria } from '../../services/category.service'; 
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductCard } from '../../../shared/components/product-card/product-card'; 
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../shared/services/cart.service'; 

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    ProductCard,
    LowerCasePipe,
    ReactiveFormsModule
  ],
  templateUrl: './category-page.html',
})
export class CategoryPage implements OnInit {

  public productos: Producto[] = [];
  public categoria: Categoria | null = null;
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  public backendUrl = 'http://localhost:3000'; 

  public filterForm: FormGroup;
  private currentCategoryId!: number;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ordersService: OrdersService, 
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cartService: CartService // <-- INYECCIÓN DEL CART SERVICE
  ) {
    this.filterForm = this.fb.group({
      nombre: [''],
      precioMin: [null],
      precioMax: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        this.currentCategoryId = Number(params.get('id'));
        if (!this.currentCategoryId) {
          throw new Error('ID de categoría no válido');
        }
        this.isLoading = true;
        this.errorMessage = null;
        this.loadCategoryInfo(); 
        this.loadProducts(); 
      })
    ).subscribe(); 
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const filters = this.filterForm.value;
    const params: any = { 
      ...filters,
      categoria_id: this.currentCategoryId
    };

    Object.keys(params).forEach(key => 
      (params[key] === null || params[key] === '') && delete params[key]
    );

    this.productService.getProductos(params).subscribe({
      next: (productos) => {
        this.productos = productos;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  onFilterSubmit(): void {
    this.loadProducts();
  }

  loadCategoryInfo(): void {
    this.categoryService.getCategories().subscribe((categorias) => {
      this.categoria = categorias.find(c => c.id === this.currentCategoryId) || null;
    });
  }

  /**
   * FUNCIÓN ACTUALIZADA: Añade el producto al CartService.
   */
  onAddToCart(producto: Producto): void { 
    if (!this.authService.isAuthenticated()) {
      this.toastr.warning('Debes iniciar sesión para añadir al carrito.', 'Acción Requerida');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.authService.getUserRole() !== 'CLIENTE') {
      this.toastr.error('Solo los clientes pueden comprar.', 'Acción No Permitida');
      return;
    }
    
    // Llama al CartService para añadir el producto y gestionar la cantidad
    this.cartService.addItem(producto);
    this.toastr.success(`¡"${producto.nombre}" añadido al carrito!`, 'Producto Añadido');
  }
}