// frontend/src/app/store/pages/account-page/account-page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalizedService } from '../../../personalizados/services/personalized.service';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-page.html',
})
export class AccountPage implements OnInit {

  public personalRequests: any[] = []; // Array para solicitudes personalizadas
  public isLoading: boolean = true;

  constructor(private personalizedService: PersonalizedService) {}

  ngOnInit(): void {
    this.loadMyRequests();
  }

  loadMyRequests(): void {
    this.isLoading = true;
    this.personalizedService.findAllMyRequests().subscribe({
      next: (data) => {
        this.personalRequests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando solicitudes:', err);
        this.isLoading = false;
      }
    });
  }

  // Función para determinar el estilo del chip de estado
  getStatusClass(estado: string): string {
    switch (estado) {
      case 'COTIZADO': return 'bg-blue-100 text-blue-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'RECHAZADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}