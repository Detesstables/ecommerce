import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonalizedService } from '../../../personalizados/services/personalized.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-request-page',
  standalone: true,
  // Asegúrate de importar ReactiveFormsModule y CommonModule
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-request-page.html',
  styleUrl: './custom-request-page.css',
})
export class CustomRequestPage implements OnInit {
  customRequestForm!: FormGroup;
  selectedFile: File | null = null; // Para almacenar el objeto File
  isLoading: boolean = false;
  submissionSuccess: boolean = false;
  submissionError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private personalizedService: PersonalizedService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Definimos los campos del formulario con sus validadores
    this.customRequestForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion_cliente: [
        '',
        [Validators.required, Validators.minLength(20)],
      ], // <-- Nuevo nombre
      presupuesto_estimado: [null, [Validators.min(1000)]],
      referencia_img_url: [''], // Este control solo maneja la selección (sin validadores)
    });
  }

  // Método para manejar la selección del archivo
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Getter para un acceso más limpio a los controles del formulario en el HTML
  get formControls() {
    return this.customRequestForm.controls;
  }

  // Método principal para enviar el formulario
  onSubmit(): void {
    // 1. Revisión de Validez (Obligatoria: Formulario e Imagen)
    if (this.customRequestForm.invalid || !this.selectedFile) {
      this.customRequestForm.markAllAsTouched();
      this.submissionError =
        'Por favor, rellena todos los campos requeridos y selecciona una imagen.';
      return;
    }

    this.isLoading = true;
    this.submissionError = null;
    this.submissionSuccess = false;

    // 2. Destructuración y tipado
    const formValue = this.customRequestForm.value;
    const formData = new FormData();
    // 3. Construcción del FormData
    formData.append('titulo', formValue.titulo);
    formData.append('descripcion_cliente', formValue.descripcion_cliente);

    // CRÍTICO: Solo enviamos el presupuesto si es > 0 o si tiene un valor.
    // Esto evita que el 0 falle el validador @Min(1000).
    if (formValue.presupuesto_estimado && formValue.presupuesto_estimado > 0) {
// 2. Destructuración y tipado
    const { titulo, descripcion_cliente, presupuesto_estimado } = this.customRequestForm.value;
    
    // Convertimos el presupuesto a un número entero ANTES de enviarlo
    const presupuesto = Number(presupuesto_estimado); 
    
    const formData = new FormData();
    
    // 1. Campos obligatorios
    // ... (append de titulo y descripcion_cliente) ...
    formData.append('titulo', titulo);
    formData.append('descripcion_cliente', descripcion_cliente);

    // --- ¡ARREGLO CRÍTICO AQUÍ! ---
    // 2. Solo enviamos el presupuesto si es un número válido y mayor a 1000
    if (presupuesto && presupuesto >= 1000) {
        // Usamos el Number() convertido, no el toString() directo del form
        formData.append('presupuesto_estimado', presupuesto.toString());
    }

    // ... (el resto del código se queda igual) ...
    }

    // Archivo
    if (this.selectedFile) {
      // 'referencia_img' debe coincidir con el FileInterceptor del backend
      formData.append(
        'referencia_img',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    // 4. Llamada al servicio
    this.personalizedService.createRequest(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.submissionSuccess = true;
        this.customRequestForm.reset();
        this.selectedFile = null;

        this.toastr.success(
          'Tu solicitud de pedido personalizado ha sido enviada. Pronto te contactaremos para la cotización.',
          'Solicitud Enviada'
        );

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.submissionSuccess = false;
        // El error del backend viene como un array de strings. Los unimos.
        const mensaje = Array.isArray(err.error?.message)
          ? err.error.message.join('; ')
          : err.error?.message || 'Ocurrió un error inesperado.';

        this.submissionError = mensaje;
        this.toastr.error(mensaje, 'Error de Validación');
        console.error('Error al enviar la solicitud:', err);
      },
    });
  }
}
