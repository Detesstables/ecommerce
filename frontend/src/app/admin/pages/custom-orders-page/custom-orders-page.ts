import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalizedService } from '../../../personalizados/services/personalized.service';
import { ToastrService } from 'ngx-toastr';

// Definimos una interfaz simplificada para la vista del Admin
interface PedidoAdmin {
  id: number;
  titulo: string;
  descripcion_cliente: string;
  estado: 'PENDIENTE' | 'COTIZADO' | 'RECHAZADO';
  usuario: { nombre: string; email: string; };
}

@Component({
  selector: 'app-custom-orders-page',
  standalone: true,
  imports: [CommonModule], // Importamos CommonModule para @if y @for
  templateUrl: './custom-orders-page.html',
})
export class CustomOrdersPage implements OnInit {

  public pedidos: PedidoAdmin[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(
    private personalizedService: PersonalizedService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.personalizedService.getPendingRequests().subscribe({
      next: (data: PedidoAdmin[]) => {
        this.pedidos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar las solicitudes. ¿El Backend está corriendo?';
        this.toastr.error('No se pudieron cargar los pedidos.', 'Error de API');
        this.isLoading = false;
      }
    });
  }

  // Función para el botón de "Cotizar/Rechazar"
  onProcessRequest(pedidoId: number): void {
    console.log('Procesar solicitud ID:', pedidoId);
    // Aquí se abriría un modal para ingresar el presupuesto final
  }
}