import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CategoryPage } from './pages/category-page/category-page'; 
import { AboutPage } from './pages/about-page/about-page';

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
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }