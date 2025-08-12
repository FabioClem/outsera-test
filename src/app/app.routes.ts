import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { TudoMoviesListComponent } from './tudo-movies-list/tudo-movies-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'movies', component: MoviesListComponent, title: 'Lista de Filmes' },
  {
    path: 'movies/tudo',
    component: TudoMoviesListComponent,
    title: 'Tudo da Lista de Filmes',
  },
];
