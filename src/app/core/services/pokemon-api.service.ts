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
  private readonly typeCache = new Map<string, Observable<TypeDetail>>();

  getPokemonIndex(limit = 10000): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`);
  }

  getTypes(): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/type`);
  }

  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getTypeDetails(idOrName: string | number): Observable<TypeDetail> {
    const url = `${this.baseUrl}/type/${idOrName}`;
    if (!this.typeCache.has(url)) {
      this.typeCache.set(url, this.http.get<TypeDetail>(url).pipe(shareReplay(1)));
    }
    return this.typeCache.get(url)!;
  }

  getTypeDetailsByUrl(url: string): Observable<TypeDetail> {
    if (!this.typeCache.has(url)) {
      this.typeCache.set(url, this.http.get<TypeDetail>(url).pipe(shareReplay(1)));
    }
    return this.typeCache.get(url)!;
  }

  getMoveDetails(url: string): Observable<MoveDetail> {
    return this.http.get<MoveDetail>(url);
  }
}
