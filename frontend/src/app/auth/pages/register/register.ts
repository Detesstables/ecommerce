import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; 
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Iconos solid

import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService
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
      this.toastr.error('Por favor, completa todos los campos requeridos.', 'Formulario Inválido');
      return; 
    }
    
    // this.errorMessage = null; // <-- Ya no se usa
    this.isLoading = true; 

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // ¡ÉXITO!
        this.toastr.success('¡Tu cuenta ha sido creada! Ahora inicia sesión.', 'Registro Exitoso');
        this.router.navigate(['/auth/login']); 
      },
      error: (err) => {
        this.isLoading = false;
        // ¡ERROR! (ej. 409 "El correo ya existe")
        const mensaje = err.error.message || 'Ocurrió un error. Inténtalo de nuevo.';
        this.toastr.error(mensaje, 'Error de Registro');
      }
    });
  }
}
