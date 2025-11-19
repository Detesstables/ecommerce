import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard'; 
import { CustomOrdersPage } from './pages/custom-orders-page/custom-orders-page';

const routes: Routes = [
  {
    path: '', // La raíz de /admin
    component: Dashboard
  },
  {
    path: 'pedidos-personalizados', 
    component: CustomOrdersPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }