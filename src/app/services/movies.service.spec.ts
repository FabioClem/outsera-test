import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MoviesService } from './movies.service';
import { of } from 'rxjs';
import {
  Movie,
  PageMovieResponse,
  YearsWithMultipleWinnersResponse,
  StudiosWithWinCountResponse,
  MaxMinWinIntervalForProducersResponse,
} from '../models/movie.models';

describe('MoviesService (mockando http.get)', () => {
  let service: MoviesService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService],
    });
    service = TestBed.inject(MoviesService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should mock http.get for getMovies', () => {
    const mockResponse: PageMovieResponse = {
      content: [
        {
          id: 1,
          year: 2020,
          title: 'A',
          studios: ['S'],
          producers: ['P'],
          winner: false,
        },
      ],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 10,
    };
    spyOn(http, 'get').and.returnValue(of(mockResponse));
    service
      .getMovies({ page: 0, size: 10, winner: true, year: 2000 })
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.content.length).toBe(1);
        expect(res.content[0].title).toBe('A');
      });
  });

  it('should mock http.get for getMovieById', () => {
    const mockMovie: Movie = {
      id: 1,
      year: 2020,
      title: 'A',
      studios: ['S'],
      producers: ['P'],
      winner: false,
    };
    spyOn(http, 'get').and.returnValue(of(mockMovie));
    service.getMovieById(1).subscribe((res) => {
      expect(res).toEqual(mockMovie);
      expect(res.id).toBe(1);
    });
  });

  it('should mock http.get for getYearsWithMultipleWinners', () => {
    const mock: YearsWithMultipleWinnersResponse = {
      years: [{ year: 2000, winnerCount: 2 }],
    };
    spyOn(http, 'get').and.returnValue(of(mock));
    service.getYearsWithMultipleWinners().subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res.years[0].year).toBe(2000);
    });
  });

  it('should mock http.get for getStudiosWithWinCount', () => {
    const mock: StudiosWithWinCountResponse = {
      studios: [{ name: 'Studio', winCount: 5 }],
    };
    spyOn(http, 'get').and.returnValue(of(mock));
    service.getStudiosWithWinCount().subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res.studios[0].name).toBe('Studio');
    });
  });

  it('should mock http.get for getMaxMinWinIntervalForProducers', () => {
    const mock: MaxMinWinIntervalForProducersResponse = { min: [], max: [] };
    spyOn(http, 'get').and.returnValue(of(mock));
    service.getMaxMinWinIntervalForProducers().subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res.min).toEqual([]);
      expect(res.max).toEqual([]);
    });
  });

  it('should mock http.get for getWinnersByYear', () => {
    const mock: Movie[] = [
      {
        id: 1,
        year: 2020,
        title: 'A',
        studios: ['S'],
        producers: ['P'],
        winner: true,
      },
    ];
    spyOn(http, 'get').and.returnValue(of(mock));
    service.getWinnersByYear(2020).subscribe((res) => {
      expect(res).toEqual(mock);
      expect(res[0].year).toBe(2020);
    });
  });
});
