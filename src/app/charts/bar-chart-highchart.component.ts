import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
if (typeof window !== 'undefined') {
  import('highcharts/modules/accessibility').then((mod: any) => {
    if (typeof mod.default === 'function') {
      mod.default(Highcharts);
    } else if (typeof mod === 'function') {
      mod(Highcharts);
    }
  });
}
import { HighchartsChartComponent } from 'highcharts-angular';

@Component({
  selector: 'app-bar-chart-highchart',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  template: `
    <div class="bar-chart-wrapper">
      <highcharts-chart
        [constructorType]="'chart'"
        [options]="chartOptions"
        style="width: 100%; height: 260px; display: block;"
      ></highcharts-chart>
    </div>
  `,
  styles: [
    `
      .bar-chart-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 220px;
        min-height: 180px;
      }
    `,
  ],
})
export class BarChartHighchartComponent implements OnChanges {
  @Input() data: { name: string; winCount: number }[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 260,
      },
      title: { text: '' },
      xAxis: {
        categories: this.data.map((item) => item.name),
        title: { text: 'Estúdio' },
        labels: { style: { fontSize: '14px' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'Vitórias', align: 'high' },
        labels: { overflow: 'justify', style: { fontSize: '14px' } },
      },
      tooltip: {
        valueSuffix: ' vitórias',
      },
      plotOptions: {
        column: {
          dataLabels: { enabled: true },
          colorByPoint: true,
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          type: 'column',
          name: 'Vitórias',
          data: this.data.map((item) => item.winCount),
        },
      ],
    };
  }
}
