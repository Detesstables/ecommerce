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

interface Testimonio {
  texto: string;
  autor: string;
  cargo: string;
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
      buttonLink: '/categoria/1'
    },
    {
      id: 2,
      nombre: 'Planners',
      tagline: 'Organiza tu día',
      promoText: 'HASTA 20% OFF',
      imageUrl: '/assets/img/p-itachi.jpg', 
      buttonText: 'Explorar Planners',
      buttonLink: '/categoria/2'
    },
    {
      id: 3,
      nombre: 'Marcadores de paginas',
      tagline: 'Colores vibrantes',
      promoText: 'MEJOR PRECIO',
      imageUrl: '/assets/img/m-zenitsu.jpg', 
      buttonText: 'Comprar Ahora',
      buttonLink: '/categoria/3'
    },
    {
      id: 4,
      nombre: 'Tacos de Notas',
      tagline: 'Nunca olvides nada',
      promoText: 'OFERTA ESPECIAL',
      imageUrl: '/assets/img/t-gatito.jpg', 
      buttonText: 'Ver Tacos',
      buttonLink: '/categoria/4'
    }
  ];

  // El índice del testimonio que estamos viendo
  currentTestimonialIndex: number = 0;

  // La lista de testimonios
  testimonios: Testimonio[] = [
    {
      texto: "¡Simplemente increíble! La calidad de los planners superó todas mis expectativas. Encontraron el diseño perfecto para mi emprendimiento y el envío fue sorprendentemente rápido.",
      autor: "Ana Gutiérrez",
      cargo: "Emprendedora"
    },
    {
      texto: "Los cuadernos son hermosos y el papel es grueso, perfecto para mis lápices. El pedido llegó antes de lo esperado y en un empaque precioso. 100% recomendado.",
      autor: "Javier Muñoz",
      cargo: "Estudiante de Diseño"
    },
    {
      texto: "Compré un set de notitas y los colores son maravillosos. Se nota la dedicación en cada producto. ¡Ya estoy pensando en mi próxima compra!",
      autor: "Camila Díaz",
      cargo: "Amante de la Papelería"
    }
  ];

  constructor() { }

  // Función para ir al siguiente testimonio
  nextTestimonial(): void {
    const nextIndex = this.currentTestimonialIndex + 1;
    if (nextIndex >= this.testimonios.length) {
      this.currentTestimonialIndex = 0; // Vuelve al primero
    } else {
      this.currentTestimonialIndex = nextIndex;
    }
  }

  // Función para ir al testimonio anterior
  prevTestimonial(): void {
    const prevIndex = this.currentTestimonialIndex - 1;
    if (prevIndex < 0) {
      this.currentTestimonialIndex = this.testimonios.length - 1; // Va al último
    } else {
      this.currentTestimonialIndex = prevIndex;
    }
  }

  // Pequeña función de ayuda para obtener el testimonio actual
  get currentTestimonial(): Testimonio {
    return this.testimonios[this.currentTestimonialIndex];
  }
}



