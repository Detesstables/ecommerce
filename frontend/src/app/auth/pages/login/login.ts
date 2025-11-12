import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService
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
      // Mostramos un toast de error si el formulario es inválido
      this.toastr.error('Por favor, ingresa tus credenciales.', 'Formulario Inválido');
      return;
    }
    
    // this.errorMessage = null; // <-- Ya no se usa
    this.isLoading = true; 
    
    const { email, contraseña } = this.loginForm.value;

    this.authService.login(email, contraseña).subscribe({
      next: (response) => {
        this.isLoading = false;
        // ¡ÉXITO! (El toast de bienvenida podría ir en el Navbar,
        // pero por ahora lo ponemos aquí)
        this.toastr.success('¡Bienvenido de vuelta!', 'Login Exitoso');
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading = false;
        // ¡ERROR! Usamos el toast
        const mensaje = err.error.message || 'Correo o contraseña incorrectos.';
        this.toastr.error(mensaje, 'Error de Login');
      }
    });
  }
}