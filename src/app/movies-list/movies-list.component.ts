import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../services/movies.service';
import { Movie, PageMovieResponse } from '../models/movie.models';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss',
})
export class MoviesListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error = '';

  years: number[] = [];
  selectedYear: string = '';
  selectedWinner: string = '';

  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  selectedMovie: Movie | null = null;
  showModal = false;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from(
      { length: currentYear - 1980 + 1 },
      (_, i) => 1980 + i
    ).reverse();
    this.fetchMovies();
  }

  fetchMovies() {
    this.loading = true;
    this.moviesService
      .getMovies({
        page: this.currentPage - 1,
        size: this.pageSize,
        winner: this.selectedWinner ? this.selectedWinner === 'sim' : undefined,
        year: this.selectedYear ? Number(this.selectedYear) : undefined,
      })
      .subscribe({
        next: (data: PageMovieResponse) => {
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

  onFilterChange() {
    this.currentPage = 1;
    this.fetchMovies();
  }

  get pagedMovies() {
    return this.movies;
  }

  get totalPages() {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchMovies();
  }

  getPaginationPages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2)
      return Array.from({ length: 5 }, (_, i) => total - 4 + i);
    return [current - 2, current - 1, current, current + 1, current + 2];
  }

  openMovieModal(movie: Movie) {
    this.selectedMovie = null;
    this.showModal = true;
    this.moviesService.getMovieById(movie.id).subscribe({
      next: (data) => {
        this.selectedMovie = data;
      },
      error: () => {
        this.selectedMovie = movie;
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedMovie = null;
  }
}
