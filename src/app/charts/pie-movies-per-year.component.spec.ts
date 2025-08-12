import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieMoviesPerYearComponent } from './pie-movies-per-year.component';
import { provideHighcharts } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Movie } from '../models/movie.models';

const mockMovies: Movie[] = [
  {
    id: 1,
    year: 2020,
    title: 'A',
    studios: ['S1'],
    producers: ['P1'],
    winner: false,
  },
  {
    id: 2,
    year: 2020,
    title: 'B',
    studios: ['S2'],
    producers: ['P2'],
    winner: false,
  },
  {
    id: 3,
    year: 2021,
    title: 'C',
    studios: ['S1'],
    producers: ['P1'],
    winner: true,
  },
  {
    id: 4,
    year: 2022,
    title: 'D',
    studios: ['S3'],
    producers: ['P3'],
    winner: false,
  },
  {
    id: 5,
    year: 2022,
    title: 'E',
    studios: ['S2'],
    producers: ['P2'],
    winner: false,
  },
];

describe('PieMoviesPerYearComponent', () => {
  let component: PieMoviesPerYearComponent;
  let fixture: ComponentFixture<PieMoviesPerYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieMoviesPerYearComponent],
      providers: [
        provideHighcharts({ instance: () => Promise.resolve(Highcharts) }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieMoviesPerYearComponent);
    component = fixture.componentInstance;
    component.movies = mockMovies;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the pie chart wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector('.pie-chart-wrapper');
    expect(wrapper)
      .withContext('Wrapper do gráfico não encontrado')
      .toBeTruthy();
  });

  it('should pass correct data to chart options', () => {
    const expectedData = [
      { name: '2020', y: 2 },
      { name: '2021', y: 1 },
      { name: '2022', y: 2 },
    ];
    const series =
      component.chartOptions.series && component.chartOptions.series[0];
    expect(series && (series as any).data).toEqual(
      jasmine.arrayWithExactContents(expectedData)
    );
  });

  it('should update chart when movies change', () => {
    const newMovies: Movie[] = [
      {
        id: 10,
        year: 2019,
        title: 'X',
        studios: ['S'],
        producers: ['P'],
        winner: false,
      },
      {
        id: 11,
        year: 2019,
        title: 'Y',
        studios: ['S'],
        producers: ['P'],
        winner: false,
      },
      {
        id: 12,
        year: 2020,
        title: 'Z',
        studios: ['S'],
        producers: ['P'],
        winner: false,
      },
    ];
    component.movies = newMovies;
    component.ngOnChanges();
    fixture.detectChanges();
    const expectedData = [
      { name: '2019', y: 2 },
      { name: '2020', y: 1 },
    ];
    const series =
      component.chartOptions.series && component.chartOptions.series[0];
    expect(series && (series as any).data).toEqual(
      jasmine.arrayWithExactContents(expectedData)
    );
  });
});
