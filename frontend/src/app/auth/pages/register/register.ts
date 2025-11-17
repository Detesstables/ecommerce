import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Region, RegionsService } from '../../../shared/services/regions.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FontAwesomeModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  showPassword = false;
  isLoading = false;
  regiones: Region[] = [];
  faArrowLeft = faArrowLeft;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private regionsService: RegionsService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      
      // --- CAMBIO AQUÍ ---
      contraseña: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20) // 1. Límite máximo actualizado a 20
      ]],
      
      region_id: ['', [Validators.required]],
      direccion_detalle: ['', [Validators.required, Validators.minLength(5)]],
      
      numero: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/), 
        Validators.maxLength(9) 
      ]],
    });

    this.loadRegiones();
  }

  loadRegiones(): void {
    this.regionsService.getRegions().subscribe({
      next: (data) => {
        this.regiones = data;
      },
      error: (err) => {
        console.error('Error cargando regiones:', err);
        this.toastr.error(
          'No se pudieron cargar las regiones. Inténtalo más tarde.',
          'Error de Conexión'
        );
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastr.error(
        'Por favor, completa todos los campos correctamente.',
        'Error de Formulario'
      );
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { nombre, email, contraseña, region_id, direccion_detalle, numero } =
      this.registerForm.value;
      
      const numero_completo = `+56${numero}`; // Resultado: '+56912345678'

    const payload = {
      nombre,
      email,
      contraseña,
      rol: 'CLIENTE',
      region_id: +region_id,
      direccion_detalle,
      numero: numero_completo,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.toastr.success(
          '¡Registro exitoso! Inicia sesión para continuar.',
          'Bienvenido'
        );
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage =
          error.error?.message ||
          'Ocurrió un error inesperado durante el registro.';
        this.toastr.error(errorMessage, 'Error de Registro');
      },
    });
  }
}