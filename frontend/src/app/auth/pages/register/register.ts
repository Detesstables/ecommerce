import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; 
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Iconos solid

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink, 
    FontAwesomeModule 
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit { 
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  showPassword = false;
  isLoading = false; // Para deshabilitar el botón mientras carga

  // Declaración de iconos de Font Awesome
  faGoogle = faGoogle;
  faArrowLeft = faArrowLeft;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // Campos ajustados a tu DTO (contraseña y dirección)
      nombre: ['', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]], // Usando 'contraseña'
      direccion: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return; 
    }

    this.errorMessage = null;
    this.isLoading = true; // Empieza a cargar

    // Obtenemos los valores del formulario
    const formData = this.registerForm.value;

    // Llamamos al servicio
    this.authService.register(formData).subscribe({
      next: (response) => {
        // ¡ÉXITO!
        this.isLoading = false;
        console.log('Registro exitoso:', response);
        // Redirigimos al login con un mensaje (opcional)
        this.router.navigate(['/auth/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (err) => {
        // ¡ERROR! (ej. 409 "El correo ya existe")
        this.isLoading = false;
        console.error('Error en el registro:', err);
        // Mostramos el mensaje de error del backend
        this.errorMessage = err.error.message || 'Ocurrió un error. Inténtalo de nuevo.';
      }
    });
  }
}
