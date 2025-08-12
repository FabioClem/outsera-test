import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Movie,
  PageMovieResponse,
  YearWithMultipleWinners,
  YearsWithMultipleWinnersResponse,
  StudioCountPerWin,
  StudiosWithWinCountResponse,
  ProducerWithInterval,
  MaxMinWinIntervalForProducersResponse,
} from '../models/movie.models';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'https://challenge.outsera.tech/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(params: {
    page: number;
    size: number;
    winner?: boolean;
    year?: number;
  }): Observable<PageMovieResponse> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size);
    if (params.winner !== undefined) {
      httpParams = httpParams.set('winner', params.winner);
    }
    if (params.year !== undefined) {
      httpParams = httpParams.set('year', params.year);
    }
    return this.http.get<PageMovieResponse>(this.apiUrl, {
      params: httpParams,
    });
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  getYearsWithMultipleWinners(): Observable<YearsWithMultipleWinnersResponse> {
    return this.http.get<YearsWithMultipleWinnersResponse>(
      `${this.apiUrl}/yearsWithMultipleWinners`
    );
  }

  getStudiosWithWinCount(): Observable<StudiosWithWinCountResponse> {
    return this.http.get<StudiosWithWinCountResponse>(
      `${this.apiUrl}/studiosWithWinCount`
    );
  }

  getMaxMinWinIntervalForProducers(): Observable<MaxMinWinIntervalForProducersResponse> {
    return this.http.get<MaxMinWinIntervalForProducersResponse>(
      `${this.apiUrl}/maxMinWinIntervalForProducers`
    );
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/winnersByYear`, {
      params: new HttpParams().set('year', year),
    });
  }
}
