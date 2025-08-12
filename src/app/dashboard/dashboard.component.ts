import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PieChartHighchartComponent } from '../charts/pie-chart-highchart.component';
import { BarChartHighchartComponent } from '../charts/bar-chart-highchart.component';
import { MoviesService } from '../services/movies.service';
import {
  YearWithMultipleWinners,
  StudioCountPerWin,
  ProducerWithInterval,
  Movie,
} from '../models/movie.models';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PieChartHighchartComponent,
    BarChartHighchartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  loadingYears = false;
  loadingStudios = false;
  loadingIntervals = false;
  loadingWinnersByYear = false;
  error = '';

  yearsWithMultipleWinners: YearWithMultipleWinners[] = [];
  topStudios: StudioCountPerWin[] = [];
  minIntervals: ProducerWithInterval[] = [];
  maxIntervals: ProducerWithInterval[] = [];
  winnersByYear: Movie[] = [];
  searchYear: string = '';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.fetchYearsWithMultipleWinners();
    this.fetchStudiosWithWinCount();
    this.fetchMaxMinWinIntervalForProducers();
  }

  fetchYearsWithMultipleWinners() {
    this.loadingYears = true;
    this.moviesService.getYearsWithMultipleWinners().subscribe({
      next: (data) => {
        this.yearsWithMultipleWinners = data.years || [];
        this.loadingYears = false;
      },
      error: () => {
        this.error = 'Erro ao carregar anos com múltiplos vencedores.';
        this.loadingYears = false;
      },
    });
  }

  fetchStudiosWithWinCount() {
    this.loadingStudios = true;
    this.moviesService.getStudiosWithWinCount().subscribe({
      next: (data) => {
        this.topStudios = (data.studios || [])
          .sort(
            (a: StudioCountPerWin, b: StudioCountPerWin) =>
              b.winCount - a.winCount
          )
          .slice(0, 3);
        this.loadingStudios = false;
      },
      error: () => {
        this.error = 'Erro ao carregar estúdios.';
        this.loadingStudios = false;
      },
    });
  }

  fetchMaxMinWinIntervalForProducers() {
    this.loadingIntervals = true;
    this.moviesService.getMaxMinWinIntervalForProducers().subscribe({
      next: (data) => {
        this.minIntervals = data.min || [];
        this.maxIntervals = data.max || [];
        this.loadingIntervals = false;
      },
      error: () => {
        this.error = 'Erro ao carregar intervalos de produtores.';
        this.loadingIntervals = false;
      },
    });
  }

  buscarVencedoresPorAno() {
    if (!this.searchYear) {
      this.winnersByYear = [];
      return;
    }
    this.loadingWinnersByYear = true;
    this.moviesService.getWinnersByYear(Number(this.searchYear)).subscribe({
      next: (data) => {
        this.winnersByYear = data;
        this.loadingWinnersByYear = false;
      },
      error: () => {
        this.error = 'Erro ao buscar vencedores do ano.';
        this.loadingWinnersByYear = false;
      },
    });
  }

  get yearsWithMultipleWinnersPieData() {
    return (this.yearsWithMultipleWinners || []).map((y) => ({
      name: String(y.year),
      value: y.winnerCount,
    }));
  }
}
