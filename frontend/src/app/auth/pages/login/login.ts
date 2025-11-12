import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FontAwesomeModule
],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  showPassword = false; 
  isLoading = false;

  // Iconos de Font Awesome
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor, ingresa tus credenciales.';
      return;
    }

    this.errorMessage = null;
    this.isLoading = true; // <-- Empieza a cargar

    // Obtenemos los valores
    const { email, contraseña } = this.loginForm.value;

    // Llamamos al servicio
    this.authService.login(email, contraseña).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso:', response);
        // ¡Redirigimos a la página principal!
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el login:', err);
        // Mostramos el error del backend (ej. "Credenciales inválidas")
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}