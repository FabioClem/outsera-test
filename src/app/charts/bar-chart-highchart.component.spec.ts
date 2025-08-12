import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartHighchartComponent } from './bar-chart-highchart.component';
import * as Highcharts from 'highcharts';
import { provideHighcharts } from 'highcharts-angular';

const studios = [
  { name: 'Studio A', winCount: 5 },
  { name: 'Studio B', winCount: 3 },
  { name: 'Studio C', winCount: 2 },
];

describe('BarChartHighchartComponent', () => {
  let component: BarChartHighchartComponent;
  let fixture: ComponentFixture<BarChartHighchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartHighchartComponent],
      providers: [
        provideHighcharts({ instance: () => Promise.resolve(Highcharts) }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartHighchartComponent);
    component = fixture.componentInstance;
    component.data = studios;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the chart wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector('.bar-chart-wrapper');
    expect(wrapper)
      .withContext('Wrapper do gráfico não encontrado')
      .toBeTruthy();
  });

  it('should pass correct categories and data to chart options', () => {
    component.ngOnChanges();
    fixture.detectChanges();
    expect(
      component.chartOptions.xAxis &&
        (component.chartOptions.xAxis as any).categories
    ).toEqual(['Studio A', 'Studio B', 'Studio C']);
    expect(
      component.chartOptions.series &&
        (component.chartOptions.series[0] as any).data
    ).toEqual([5, 3, 2]);
  });

  it('should update chart when data changes', () => {
    const newData = [
      { name: 'Studio X', winCount: 10 },
      { name: 'Studio Y', winCount: 7 },
    ];
    component.data = newData;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(
      component.chartOptions.xAxis &&
        (component.chartOptions.xAxis as any).categories
    ).toEqual(['Studio X', 'Studio Y']);
    expect(
      component.chartOptions.series &&
        (component.chartOptions.series[0] as any).data
    ).toEqual([10, 7]);
  });
});
