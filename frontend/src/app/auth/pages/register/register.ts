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
      numero: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente.', 'Error de Formulario');
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; // Activa el spinner

    const { nombre, email, contraseña, direccion, numero } = this.registerForm.value; // <-- ¡Asegúrate que 'numero' esté aquí!

    this.authService.register({ nombre, email, contraseña, rol: 'CLIENTE', direccion, numero }).subscribe({ // <-- ¡Asegúrate que 'numero' esté aquí!
      next: () => {
        this.toastr.success('¡Registro exitoso! Inicia sesión para continuar.', 'Bienvenido');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false; // Desactiva el spinner
        const errorMessage = error.error?.message || 'Ocurrió un error inesperado durante el registro.';
        this.toastr.error(errorMessage, 'Error de Registro');
      }
    });
  }
}
