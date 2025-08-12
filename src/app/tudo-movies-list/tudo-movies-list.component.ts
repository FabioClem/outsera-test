import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../services/movies.service';
import { Movie, StudioCountPerWin } from '../models/movie.models';
import { BarChartHighchartComponent } from '../charts/bar-chart-highchart.component';
import { PieMoviesPerYearComponent } from '../charts/pie-movies-per-year.component';

@Component({
  selector: 'app-tudo-movies-list',
  standalone: true,
  imports: [CommonModule, PieMoviesPerYearComponent],
  templateUrl: './tudo-movies-list.component.html',
  styleUrl: './tudo-movies-list.component.scss',
})
export class TudoMoviesListComponent implements OnInit {
  movies: Movie[] = [];
  totalElements = 0;
  currentPage = 1;
  pageSize = 999;
  selectedWinner: string | undefined;
  selectedYear: string | undefined;
  loading = true;
  error = '';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.loading = true;
    this.moviesService
      .getMovies({
        page: this.currentPage - 1,
        size: this.pageSize,
        winner: this.selectedWinner ? this.selectedWinner === 'sim' : undefined,
        year: this.selectedYear ? Number(this.selectedYear) : undefined,
      })
      .subscribe({
        next: (data) => {
          this.movies = data.content;
          this.totalElements = data.totalElements;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar filmes.';
          this.loading = false;
        },
      });
  }
}
