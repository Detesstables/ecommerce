// frontend/src/app/admin/pages/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ProductService, Producto } from '../../../store/services/product.service';

// Importamos los componentes que usaremos
import { Modal } from '../../../shared/components/modal/modal';
import { ProductForm } from '../../components/product-form/product-form';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [
    CommonModule,
    Modal, // Modal (la cáscara)
    ProductForm // Formulario (el contenido)
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  
  public productos: Producto[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  public backendUrl = 'http://localhost:3000'; // Para las imágenes

  // Lógica del Modal
  public isModalOpen: boolean = false;
  public dataToEdit: Producto | null = null; 

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null; // Limpia errores antiguos
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  // --- ¡ESTA ES LA LÓGICA CLAVE! ---

  // Se llama al hacer clic en "+ Crear Nuevo Producto"
  onCreate(): void {
    this.dataToEdit = null; // Pone el modal en modo "Crear"
    this.isModalOpen = true;
  }

  // Se llama al hacer clic en "Editar" en la tabla
  onEdit(producto: Producto): void {
    this.dataToEdit = producto; // Pone el modal en modo "Editar"
    this.isModalOpen = true;
  }

  // Se llama cuando el Modal emite (close) o (cancel)
  onCloseModal(): void {
    this.isModalOpen = false;
    this.dataToEdit = null; // Limpia el estado
  }

  // Se llama cuando el ProductForm emite (save)
  onSave(formData: FormData): void {
    this.isLoading = true;
    this.errorMessage = null;

    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Si 'dataToEdit' tiene un producto, actualizamos.
    if (this.dataToEdit) {
      // --- MODO EDICIÓN ---
      this.productService.updateProducto(this.dataToEdit.id, formData).subscribe({
        next: (updatedProduct) => {
          console.log('Producto actualizado:', updatedProduct);
          this.loadProducts(); // Recarga la tabla
          this.onCloseModal(); // Cierra el modal
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.errorMessage = err.error.message || 'Error al actualizar el producto.';
          this.isLoading = false;
        }
      });
    } else {
      // --- MODO CREACIÓN ---
      // Si 'dataToEdit' es 'null', creamos.
      this.productService.createProducto(formData).subscribe({
        next: (newProduct) => {
          console.log('Producto creado:', newProduct);
          this.loadProducts(); 
          this.onCloseModal(); 
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.errorMessage = err.error.message || 'Error al crear el producto.';
          this.isLoading = false;
        }
      });
    }
  }
  
  // --- (El resto de funciones se quedan igual) ---
  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProducto(id).subscribe({
        next: () => {
          this.loadProducts(); 
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar el producto.';
        }
      });
    }
  }

  formatPrice(precio: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}