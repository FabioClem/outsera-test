import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
import { Movie } from '../models/movie.models';

@Component({
  selector: 'app-pie-movies-per-year',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  template: `
    <div class="pie-chart-wrapper">
      <highcharts-chart
        [constructorType]="'chart'"
        [options]="chartOptions"
        style="width: 100%;  display: block;"
      ></highcharts-chart>
    </div>
  `,
  styles: [
    `
      .pie-chart-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 700px;
        min-width: 160px;
        min-height: 160px;
      }
    `,
  ],
})
export class PieMoviesPerYearComponent implements OnChanges {
  @Input() movies: Movie[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    const yearMap = new Map<number, number>();
    this.movies.forEach((movie) => {
      yearMap.set(movie.year, (yearMap.get(movie.year) || 0) + 1);
    });
    const data = Array.from(yearMap.entries()).map(([year, count]) => ({
      name: String(year),
      y: count,
    }));
    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 700,
      },
      title: { text: '' },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} filmes)',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Filmes',
          data,
        },
      ],
    };
  }
}
