import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CategoryPage } from './pages/category-page/category-page'; 
import { AboutPage } from './pages/about-page/about-page';
import { CartPage } from './pages/cart-page/cart-page';
import { CustomRequestPage } from './pages/custom-request-page/custom-request-page';
import { QuotationViewPage } from './pages/quotation-view-page/quotation-view-page';
import { authGuard } from '../auth/guards/auth-guard';
import { AccountPage } from './pages/account-page/account-page';

const routes: Routes = [
  {
    path: '', 
    component: Home
  },
  {
    path: 'categoria/:id', 
    component: CategoryPage
  },
  {
    path: 'sobre-nosotros',
    component: AboutPage
  },
  {
    path: 'cart',
    component: CartPage
  },
  {
    path: 'pesonalizado/solicitar',
    component: CustomRequestPage
  },
  {
    path: 'cotizacion/:id', 
    component: QuotationViewPage,
    canActivate: [authGuard] 
  },
  {
    path: 'mi-cuenta', // <-- RUTA NUEVA
    component: AccountPage,
    canActivate: [authGuard] // <-- Debe estar protegido
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }