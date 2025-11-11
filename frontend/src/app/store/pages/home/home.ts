import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CategoryBanner {
  id: number;
  nombre: string;     // Ej. Cuadernos
  tagline: string;    // Ej. DISEÑOS ÚNICOS
  promoText?: string; // Ej. "BIG SAVING" o "15% OFF" (Opcional)
  imageUrl: string;
  buttonText: string; // Ej. "Comprar Ahora"
  buttonLink: string; // Ruta a donde va el botón
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  
  image: string = '/assets/img/HeroHome.jpg'; 
  
  categoriasBanner: CategoryBanner[] = [
    {
      id: 1,
      nombre: 'Cuadernos',
      tagline: 'Papelería con estilo',
      promoText: 'NUEVOS DISEÑOS',
      imageUrl: '/assets/img/HeroHome.jpg', 
      buttonText: 'Ver Cuadernos',
      buttonLink: '/productos/categoria/1'
    },
    {
      id: 2,
      nombre: 'Planners',
      tagline: 'Organiza tu día',
      promoText: 'HASTA 20% OFF',
      imageUrl: '/assets/img/p-itachi.jpg', 
      buttonText: 'Explorar Planners',
      buttonLink: '/productos/categoria/2'
    },
    {
      id: 3,
      nombre: 'Marcadores de paginas',
      tagline: 'Colores vibrantes',
      promoText: 'MEJOR PRECIO',
      imageUrl: '/assets/img/m-zenitsu.jpg', 
      buttonText: 'Comprar Ahora',
      buttonLink: '/productos/categoria/3'
    },
    {
      id: 4,
      nombre: 'Tacos de Notas',
      tagline: 'Nunca olvides nada',
      promoText: 'OFERTA ESPECIAL',
      imageUrl: '/assets/img/t-gatito.jpg', 
      buttonText: 'Ver Tacos',
      buttonLink: '/productos/categoria/4'
    }
  ];

  constructor() { }
}



