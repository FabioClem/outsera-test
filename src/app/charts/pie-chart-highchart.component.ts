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
  selector: 'app-pie-chart-highchart',
  standalone: true,
  imports: [CommonModule, HighchartsChartComponent],
  template: `
    <div class="pie-chart-wrapper">
      <highcharts-chart
        [constructorType]="'chart'"
        [options]="chartOptions"
        style="width: 100%; height: 220px; display: block;"
      ></highcharts-chart>
    </div>
  `,
  styles: [
    `
      .pie-chart-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 220px;
        min-width: 160px;
        min-height: 160px;
      }
    `,
  ],
})
export class PieChartHighchartComponent implements OnChanges {
  @Input() data: { year: number; winnerCount: number }[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 220,
      },
      title: { text: '' },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} vencedores)',
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
          name: 'Vencedores',
          data: this.data.map((item) => ({
            name: String(item.year),
            y: item.winnerCount,
          })),
        },
      ],
    };
  }
}
