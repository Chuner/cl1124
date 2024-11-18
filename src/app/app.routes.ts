import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewRentalComponent } from './new-rental/new-rental.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  }, 
  {
    path: 'new',
    component: NewRentalComponent,
    title: 'New Tool Rental'
  }
];
