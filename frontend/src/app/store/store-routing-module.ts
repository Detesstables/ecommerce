import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CategoryPage } from './pages/category-page/category-page'; 

const routes: Routes = [
  {
    path: '', 
    component: Home
  },
  {
    path: 'categoria/:id', 
    component: CategoryPage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }