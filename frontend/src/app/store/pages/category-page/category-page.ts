// frontend/src/app/store/pages/category-page/category-page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators'; // <-- Ya no se usa debounceTime
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; 

import { ProductService, Producto } from '../../services/product.service'; 
import { CategoryService, Categoria } from '../../services/category.service'; 
import { OrderService } from '../../services/order.service'; 
import { AuthService } from '../../../auth/services/auth.service';
import { ProductCard } from '../../../shared/components/product-card/product-card'; 
import { ToastrService } from 'ngx-toastr';

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
    private orderService: OrderService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      nombre: [''],
      precioMin: [null],
      precioMax: [null]
    });
  }

  // --- 'ngOnInit' MÁS SIMPLE ---
  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        this.currentCategoryId = Number(params.get('id'));
        if (!this.currentCategoryId) {
          throw new Error('ID de categoría no válido');
        }
        this.isLoading = true;
        this.errorMessage = null;
        this.loadCategoryInfo(); // Carga el banner

        // Llama a la carga inicial de productos (sin filtros)
        this.loadProducts(); 
      })
    ).subscribe(); // Solo necesitamos que se active
  }

  // --- NUEVA FUNCIÓN 'loadProducts' ---
  // Esta función carga los productos (con o sin filtros)
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const filters = this.filterForm.value;
    const params: any = { 
      ...filters,
      categoria_id: this.currentCategoryId
    };

    // Limpia filtros vacíos
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

  // --- ¡NUEVA FUNCIÓN PARA EL BOTÓN! ---
  onFilterSubmit(): void {
    // Simplemente vuelve a llamar a 'loadProducts',
    // que leerá los valores actuales del formulario.
    this.loadProducts();
  }

  // Carga la info del banner
  loadCategoryInfo(): void {
    this.categoryService.getCategories().subscribe((categorias) => {
      this.categoria = categorias.find(c => c.id === this.currentCategoryId) || null;
    });
  }

  // onComprarProducto (se queda igual)
  onComprarProducto(productoId: number): void {
    if (!this.authService.isAuthenticated()) {
      this.toastr.warning('Debes iniciar sesión para comprar', 'Acción Requerida');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.authService.getUserRole() !== 'CLIENTE') {
      this.toastr.error('Los administradores no pueden realizar compras', 'Acción No Permitida');
      return;
    }
    this.orderService.comprarProducto(productoId).subscribe({
      next: (response) => {
        this.toastr.success('¡Producto comprado con éxito!', 'Compra Realizada');
        this.loadProducts(); // Recarga los productos con filtros
      },
      error: (err) => {
        const mensaje = err.error.message || 'No se pudo procesar la compra.';
        this.toastr.error(mensaje, 'Error en la Compra');
      }
    });
  }
}