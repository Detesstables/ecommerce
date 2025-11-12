import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { ProductForm } from './components/product-form/product-form';

@NgModule({
  declarations: [
    // ¡BORRA 'ProductFormComponent' DE AQUÍ!
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    ProductForm // <-- ¡AÑÁDELO AQUÍ, EN IMPORTS!
  ],
  exports: [
    // (Opcional, pero limpio) Borra ProductFormComponent de aquí también.
  ]
})
export class AdminModule { }