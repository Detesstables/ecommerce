import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para @if

@Component({
  selector: 'app-modal',
  standalone: true, // ¡Importante! Es standalone
  imports: [CommonModule], // Importa CommonModule para @if
  templateUrl: './modal.html',
})
export class Modal {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}