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
  if (this.customRequestForm.invalid || !this.selectedFile) {
    this.customRequestForm.markAllAsTouched();
    this.submissionError =
      'Por favor, rellena todos los campos requeridos y selecciona una imagen.';
    return;
  }

  this.isLoading = true;
  this.submissionError = null;

  const { titulo, descripcion_cliente, presupuesto_estimado } =
    this.customRequestForm.value;

  const formData = new FormData();

  formData.append('titulo', titulo);
  formData.append('descripcion_cliente', descripcion_cliente);

  // Enviar solo si cumple el mínimo
  if (presupuesto_estimado && Number(presupuesto_estimado) >= 1000) {
    formData.append(
      'presupuesto_estimado',
      Number(presupuesto_estimado).toString()
    );
  }

  // Imagen
  formData.append('referencia_img', this.selectedFile!, this.selectedFile!.name);

  this.personalizedService.createRequest(formData).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.toastr.success(
        'Tu solicitud de pedido personalizado ha sido enviada.',
        'Solicitud Enviada'
      );
      this.customRequestForm.reset();
      this.selectedFile = null;
      this.router.navigate(['/']);
    },
    error: (err) => {
      this.isLoading = false;
      this.submissionError = err.error?.message || 'Error inesperado.';
      this.toastr.error(this.submissionError ?? 'Error inesperado.', 'Error');
    },
  });
}
}
