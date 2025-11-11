import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home'; 

const routes: Routes = [
  {
    path: '', // <-- Esta es la ruta raíz del módulo ('/')
    component: Home // <-- Carga el componente Home
  }
  // Aquí pondremos la ruta de 'product-detail' más tarde y las otras vistas porsupuesto
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }