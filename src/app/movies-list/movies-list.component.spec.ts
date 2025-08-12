import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesListComponent } from './movies-list.component';
import { MoviesService } from '../services/movies.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Movie, PageMovieResponse } from '../models/movie.models';

describe('MoviesListComponent', () => {
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;
  let moviesService: jasmine.SpyObj<MoviesService>;

  const mockMovies: Movie[] = [
    {
      id: 1,
      year: 2020,
      title: 'Movie 1',
      studios: ['Studio A'],
      producers: ['Producer X'],
      winner: true,
    },
    {
      id: 2,
      year: 2021,
      title: 'Movie 2',
      studios: ['Studio B'],
      producers: ['Producer Y'],
      winner: false,
    },
  ];
  const mockPage: PageMovieResponse = {
    content: mockMovies,
    totalPages: 1,
    totalElements: 2,
    number: 0,
    size: 10,
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoviesService', [
      'getMovies',
      'getMovieById',
    ]);
    spy.getMovies.and.returnValue(of(mockPage));
    spy.getMovieById.and.callFake((id: number) =>
      of(mockMovies.find((m) => m.id === id)!)
    );
    await TestBed.configureTestingModule({
      imports: [MoviesListComponent, HttpClientTestingModule],
      providers: [{ provide: MoviesService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    moviesService = TestBed.inject(
      MoviesService
    ) as jasmine.SpyObj<MoviesService>;
  });

  function setupMoviesServiceSuccess() {
    moviesService.getMovies.and.returnValue(of(mockPage));
    moviesService.getMovieById.and.callFake((id: number) =>
      of(mockMovies.find((m) => m.id === id)!)
    );
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render table with movies', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const table: HTMLElement | null =
      fixture.nativeElement.querySelector('.movies-list-table');
    expect(table).withContext('Tabela não encontrada no DOM').toBeTruthy();
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).withContext('Quantidade de linhas inesperada').toBe(2);
    expect(rows[0]?.textContent)
      .withContext('Primeira linha não encontrada')
      .toContain('Movie 1');
    expect(rows[1]?.textContent)
      .withContext('Segunda linha não encontrada')
      .toContain('Movie 2');
  }));

  it('should show error message', () => {
    component.loading = false;
    component.error = 'Erro ao carregar filmes.';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('.movies-list-error');
    expect(error).withContext('Elemento de erro não encontrado').toBeTruthy();
    if (!error) return;
    expect(error.textContent).toContain('Erro ao carregar filmes.');
  });

  it('should filter by year and winner', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const yearSelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#year-select');
    const winnerSelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#winner-select');
    yearSelect.value = yearSelect.options[1].value;
    yearSelect.dispatchEvent(new Event('change'));
    winnerSelect.value = 'sim';
    winnerSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.selectedYear).toBe(yearSelect.value);
    expect(component.selectedWinner).toBe('sim');
  }));

  it('should open and close modal with movie details', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length)
      .withContext('Nenhuma linha encontrada para abrir modal')
      .toBeGreaterThan(0);
    const row = rows[0];
    row.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.showModal).toBeTrue();
    expect(component.selectedMovie).toEqual(mockMovies[0]);
    const modal = fixture.nativeElement.querySelector('.movie-modal-backdrop');
    if (modal) {
      modal.click();
      fixture.detectChanges();
      expect(component.showModal).toBeFalse();
    }
  }));

  it('should handle service error', fakeAsync(() => {
    moviesService.getMovies.and.returnValue(
      throwError(() => new Error('fail'))
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.error).toBe('Erro ao carregar filmes.');
    const error = fixture.nativeElement.querySelector('.movies-list-error');
    expect(error).withContext('Elemento de erro não encontrado').toBeTruthy();
  }));

  it('should render pagination', fakeAsync(() => {
    setupMoviesServiceSuccess();
    component.totalElements = 25;
    component.pageSize = 10;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const pages = component.getPaginationPages();
    expect(pages.length).toBeGreaterThan(0);
  }));
});
