import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../store/services/product.service';
import { CategoryService, Categoria } from '../../../store/services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
})
// ¡Implementa OnChanges!
export class ProductForm implements OnInit, OnChanges { 

  @Input() data: Producto | null = null; 
  @Output() save = new EventEmitter<FormData>();

  productForm!: FormGroup;
  isEditMode: boolean = false;
  selectedFile: File | null = null; 
  public categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria_id: [null, Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    // ngOnInit ahora solo carga las categorías
    this.loadCategories();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Si 'data' cambió (de null a producto, o viceversa)...
      this.isEditMode = !!this.data; // Actualiza el modo (true/false)

      // Reseteamos el formulario con los nuevos valores
      // Si 'this.data' es 'null' (modo Crear), resetea a valores vacíos.
      this.productForm.reset({
        nombre: this.data?.nombre || '',
        descripcion: this.data?.descripcion || '',
        precio: this.data?.precio || 0,
        stock: this.data?.stock || 0,
        categoria_id: this.data?.categoria_id || null,
        imagen: null // Siempre resetea el input de la imagen
      });

      this.selectedFile = null; // Limpia el archivo seleccionado
    }
  }
  // ---------------------------------

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => { this.categorias = cats; },
      error: (err) => { console.error('Error al cargar categorías', err); }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('nombre', this.productForm.get('nombre')?.value);
    formData.append('descripcion', this.productForm.get('descripcion')?.value);
    formData.append('precio', this.productForm.get('precio')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('categoria_id', this.productForm.get('categoria_id')?.value);
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }
    this.save.emit(formData);
  }
}