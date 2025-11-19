import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalizedService } from '../../../personalizados/services/personalized.service';
import { ToastrService } from 'ngx-toastr';
import { QuoteForm } from '../../components/quote-form/quote-form';
import { Modal } from "../../../shared/components/modal/modal";

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
  imports: [CommonModule, QuoteForm, Modal], // Importamos CommonModule para @if y @for
  templateUrl: './custom-orders-page.html',
})
export class CustomOrdersPage implements OnInit {

  public pedidos: PedidoAdmin[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  public selectedPedido: PedidoAdmin | null = null; // <-- Ahora guardaremos el pedido completo
  public isModalOpen: boolean = false; // <-- Control del modal

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

// Nuevo manejador del botón "Cotizar/Revisar"
  onProcessRequest(pedidoId: number): void {
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      this.selectedPedido = pedido;
      this.isModalOpen = true; // Abre el modal
    }
  }

  // Cierra el modal
  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedPedido = null;
  }
  
  // Maneja la acción después de que el formulario se envía con éxito
  onStatusUpdated(): void {
    this.onCloseModal(); // Cierra el modal
    this.loadPedidos(); // Recarga la lista para ver los cambios
  }
}