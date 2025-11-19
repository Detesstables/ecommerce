import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonalizedService } from '../../../personalizados/services/personalized.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-form.html',
})
export class QuoteForm implements OnInit {
  
  @Input() pedidoId!: number;
  @Input() pedidoActual: any; // Opcional: Para mostrar detalles del pedido
  @Output() formClosed = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<void>(); // Notificar al padre para recargar lista

  public quoteForm!: FormGroup;
  public isCotizando: boolean = true; // Controla si es COTIZAR o RECHAZAR
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private personalizedService: PersonalizedService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.quoteForm = this.fb.group({
      // Campo obligatorio si estamos cotizando, no obligatorio si rechazamos.
      presupuesto_final: [
        null, 
        [Validators.min(1), Validators.pattern(/^[0-9]*$/)]
      ],
      // Campo para observaciones, obligatorio si rechazamos.
      observacion_admin: ['', [Validators.required, Validators.maxLength(500)]]
    });

    // Subscripción para manejar la validación dinámica:
    // Si cambia el estado a COTIZAR/RECHAZAR, actualiza los validadores
    this.quoteForm.valueChanges.subscribe(() => {
        this.updateValidators();
    });
    this.updateValidators(); // Llama inicial
  }

  // --- Lógica de Validación Dinámica ---
  updateValidators(): void {
    const presupuestoControl = this.quoteForm.get('presupuesto_final');
    const observacionControl = this.quoteForm.get('observacion_admin');

    if (this.isCotizando) {
      // Si cotizamos: Presupuesto es OBLIGATORIO y observación es OPCIONAL.
      presupuestoControl?.setValidators([Validators.required, Validators.min(1), Validators.pattern(/^[0-9]*$/)]);
      observacionControl?.clearValidators();
    } else {
      // Si rechazamos: Observación es OBLIGATORIA y presupuesto es NULO.
      presupuestoControl?.clearValidators();
      observacionControl?.setValidators([Validators.required, Validators.maxLength(500)]);
      presupuestoControl?.setValue(null, { emitEvent: false }); // Limpia el valor de presupuesto
    }
    presupuestoControl?.updateValueAndValidity({ emitEvent: false });
    observacionControl?.updateValueAndValidity({ emitEvent: false });
  }

  // --- Manejador del Formulario (DML: UPDATE) ---
  onSubmit(): void {
    const estado: 'COTIZADO' | 'RECHAZADO' = this.isCotizando ? 'COTIZADO' : 'RECHAZADO';
    this.updateValidators(); // Validación final

    if (this.quoteForm.invalid) {
      this.toastr.error(`Por favor, rellena los campos requeridos para ${estado === 'COTIZADO' ? 'cotizar' : 'rechazar'}.`, 'Error de Formulario');
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { presupuesto_final, observacion_admin } = this.quoteForm.value;

    const dto = {
      estado: estado,
      presupuesto_final: estado === 'COTIZADO' ? presupuesto_final : null,
      observacion_admin: observacion_admin || ''
    };

    // EJECUCIÓN DEL DML
    this.personalizedService.updateStatus(this.pedidoId, dto).subscribe({
      next: (response) => {
        this.toastr.success(`Pedido ID ${this.pedidoId} ha sido ${estado === 'COTIZADO' ? 'COTIZADO' : 'RECHAZADO'} con éxito.`, 'Éxito');
        this.statusUpdated.emit(); // Notifica a la tabla principal para que se recargue
        this.formClosed.emit();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al actualizar el estado del pedido.', 'Error de API');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}