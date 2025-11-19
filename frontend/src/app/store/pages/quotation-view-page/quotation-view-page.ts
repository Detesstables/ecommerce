import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs'; 
import { ToastrService } from 'ngx-toastr';

// --- SERVICIOS ---
import { PersonalizedService } from '../../../personalizados/services/personalized.service';
import { OrdersService } from '../../services/orders.service';

// Interfaz para la data de la Cotización
interface QuotationDetails {
  id: number;
  titulo: string;
  presupuesto_final: number;
  producto_id: number;
  estado: string; // COTIZADO, RECHAZADO, etc.
  observacion_admin: string | null;
  usuario: { nombre: string; email: string; };
}

@Component({
  selector: 'app-quotation-view-page',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Añade CurrencyPipe
  templateUrl: './quotation-view-page.html',
})
export class QuotationViewPage implements OnInit {
  
  public quotation: QuotationDetails | null = null;
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalizedService: PersonalizedService,
    private orderService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // 1. Leer el ID de la URL y usar switchMap para cargar los datos
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) return of(null);
        
        this.isLoading = true;
        this.errorMessage = null;

        // 2. Llama al servicio de backend para obtener los detalles del pedido
        return this.personalizedService.getQuotationDetails(id);
      })
    ).subscribe({
      next: (data: any) => {
        this.quotation = data;
        this.isLoading = false;

        // Si el pedido no está en estado COTIZADO, no se puede pagar
        if (data && data.estado !== 'COTIZADO') {
            this.errorMessage = `Este pedido no está listo para pago. Estado actual: ${data.estado}.`;
        }
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la cotización o esta no existe.';
        this.toastr.error('Cotización no encontrada o acceso denegado.', 'Error');
        this.isLoading = false;
      }
    });
  }

  // --- FUNCIÓN DE PAGO FINAL (Cerrar el ciclo DML) ---
  onFinalPayment(): void {
if (!this.quotation) {
  this.toastr.error('No se puede procesar el pago. Falta la cotización.', 'Error');
  return;
}

this.isLoading = true;

this.personalizedService.comprarPedido(this.quotation.id).subscribe({
  next: () => {
    this.toastr.success('Pago confirmado. ¡Tu pedido está en preparación!', 'Éxito');
    this.router.navigate(['/']);
  },
  error: (err) => {
    this.toastr.error(err.error.message || 'Error de pago: Intenta de nuevo.', 'Fallo en la Transacción');
    this.isLoading = false;
  }
});

  }
}