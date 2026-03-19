import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import {
  PokemonListResponse,
  PokemonDetail,
  MoveDetail,
  TypeDetail,
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private readonly cache = new Map<string, Observable<any>>();

  private getCached<T>(url: string): Observable<T> {
    if (!this.cache.has(url)) {
      this.cache.set(url, this.http.get<T>(url).pipe(shareReplay(1)));
    }
    return this.cache.get(url)!;
  }

  getPokemonIndex(limit = 10000): Observable<PokemonListResponse> {
    return this.getCached<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`);
  }

  getTypes(): Observable<PokemonListResponse> {
    return this.getCached<PokemonListResponse>(`${this.baseUrl}/type`);
  }

  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return this.getCached<PokemonDetail>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getTypeDetails(idOrName: string | number): Observable<TypeDetail> {
    return this.getCached<TypeDetail>(`${this.baseUrl}/type/${idOrName}`);
  }

  getTypeDetailsByUrl(url: string): Observable<TypeDetail> {
    return this.getCached<TypeDetail>(url);
  }

  getMoveDetails(url: string): Observable<MoveDetail> {
    return this.getCached<MoveDetail>(url);
  }
}
