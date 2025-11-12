import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { faPalette, faFeatherAlt, faMapSigns, faArrowRight  } from '@fortawesome/free-solid-svg-icons'; 
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,

  ],
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css']
})
export class AboutPage {

  // Declaración de íconos para el template
  faPalette = faPalette;
  faFeatherAlt = faFeatherAlt;
  faMapSigns = faMapSigns;
  faArrowRight = faArrowRight;
  faInstagram = faInstagram;

  constructor() {}
}