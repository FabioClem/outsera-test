import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { provideHighcharts } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { MoviesService } from '../services/movies.service';
import { of, throwError } from 'rxjs';

const mockYears = {
  years: [
    { year: 2000, winnerCount: 2 },
    { year: 2001, winnerCount: 3 },
  ],
};
const mockStudios = {
  studios: [
    { name: 'Studio A', winCount: 5 },
    { name: 'Studio B', winCount: 3 },
    { name: 'Studio C', winCount: 2 },
  ],
};
const mockIntervals = {
  min: [{ producer: 'P1', interval: 1, previousWin: 2000, followingWin: 2001 }],
  max: [
    { producer: 'P2', interval: 10, previousWin: 1990, followingWin: 2000 },
  ],
};
const mockWinners = [
  {
    id: 1,
    year: 2000,
    title: 'Movie 1',
    studios: ['Studio A'],
    producers: ['P1'],
    winner: true,
  },
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoviesService', [
      'getYearsWithMultipleWinners',
      'getStudiosWithWinCount',
      'getMaxMinWinIntervalForProducers',
      'getWinnersByYear',
    ]);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: MoviesService, useValue: spy },
        provideHighcharts({ instance: () => Promise.resolve(Highcharts) }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(
      MoviesService
    ) as jasmine.SpyObj<MoviesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch years with multiple winners on init', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));
    moviesService.getStudiosWithWinCount.and.returnValue(of(mockStudios));
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      of(mockIntervals)
    );
    fixture.detectChanges();
    tick();
    expect(moviesService.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(component.yearsWithMultipleWinners.length).toBe(2);
    expect(component.loadingYears).toBeFalse();
  }));

  it('should handle error on fetchYearsWithMultipleWinners', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(
      throwError(() => new Error('fail'))
    );
    moviesService.getStudiosWithWinCount.and.returnValue(of(mockStudios));
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      of(mockIntervals)
    );
    fixture.detectChanges();
    tick();
    expect(component.error).toContain(
      'Erro ao carregar anos com múltiplos vencedores.'
    );
    expect(component.loadingYears).toBeFalse();
  }));

  it('should fetch studios with win count and sort top 3', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));
    moviesService.getStudiosWithWinCount.and.returnValue(of(mockStudios));
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      of(mockIntervals)
    );
    fixture.detectChanges();
    tick();
    expect(moviesService.getStudiosWithWinCount).toHaveBeenCalled();
    expect(component.topStudios.length).toBe(3);
    expect(component.topStudios[0].name).toBe('Studio A');
    expect(component.loadingStudios).toBeFalse();
  }));

  it('should handle error on fetchStudiosWithWinCount', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));
    moviesService.getStudiosWithWinCount.and.returnValue(
      throwError(() => new Error('fail'))
    );
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      of(mockIntervals)
    );
    fixture.detectChanges();
    tick();
    expect(component.error).toContain('Erro ao carregar estúdios.');
    expect(component.loadingStudios).toBeFalse();
  }));

  it('should fetch max/min win intervals for producers', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));
    moviesService.getStudiosWithWinCount.and.returnValue(of(mockStudios));
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      of(mockIntervals)
    );
    fixture.detectChanges();
    tick();
    expect(moviesService.getMaxMinWinIntervalForProducers).toHaveBeenCalled();
    expect(component.minIntervals.length).toBe(1);
    expect(component.maxIntervals.length).toBe(1);
    expect(component.loadingIntervals).toBeFalse();
  }));

  it('should handle error on fetchMaxMinWinIntervalForProducers', fakeAsync(() => {
    moviesService.getYearsWithMultipleWinners.and.returnValue(of(mockYears));
    moviesService.getStudiosWithWinCount.and.returnValue(of(mockStudios));
    moviesService.getMaxMinWinIntervalForProducers.and.returnValue(
      throwError(() => new Error('fail'))
    );
    fixture.detectChanges();
    tick();
    expect(component.error).toContain(
      'Erro ao carregar intervalos de produtores.'
    );
    expect(component.loadingIntervals).toBeFalse();
  }));

  it('should fetch winners by year', fakeAsync(() => {
    moviesService.getWinnersByYear.and.returnValue(of(mockWinners));
    component.searchYear = '2000';
    component.buscarVencedoresPorAno();
    tick();
    expect(moviesService.getWinnersByYear).toHaveBeenCalledWith(2000);
    expect(component.winnersByYear.length).toBe(1);
    expect(component.loadingWinnersByYear).toBeFalse();
  }));

  it('should handle error on buscarVencedoresPorAno', fakeAsync(() => {
    moviesService.getWinnersByYear.and.returnValue(
      throwError(() => new Error('fail'))
    );
    component.searchYear = '2000';
    component.buscarVencedoresPorAno();
    tick();
    expect(component.error).toContain('Erro ao buscar vencedores do ano.');
    expect(component.loadingWinnersByYear).toBeFalse();
  }));

  it('should clear winnersByYear if searchYear is empty', () => {
    component.winnersByYear = [
      {
        id: 1,
        year: 2000,
        title: 'Movie 1',
        studios: ['Studio A'],
        producers: ['P1'],
        winner: true,
      },
    ];
    component.searchYear = '';
    component.buscarVencedoresPorAno();
    expect(component.winnersByYear.length).toBe(0);
  });

  it('should return correct pie data for yearsWithMultipleWinnersPieData', () => {
    component.yearsWithMultipleWinners = [
      { year: 2000, winnerCount: 2 },
      { year: 2001, winnerCount: 3 },
    ];
    const pieData = component.yearsWithMultipleWinnersPieData;
    expect(pieData).toEqual([
      { name: '2000', value: 2 },
      { name: '2001', value: 3 },
    ]);
  });
});
