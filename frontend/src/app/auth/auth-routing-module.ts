// frontend/src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

const routes: Routes = [
  {
    path: 'login', // <-- CAMBIO AQUÍ (de '' a 'login')
    component: Login 
  },
  {
    path: 'registro', 
    component: Register
  },
  {
    path: '', // <-- CAMBIO AQUÍ
    redirectTo: 'login', // Si alguien va a /auth, redirige a /auth/login
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }