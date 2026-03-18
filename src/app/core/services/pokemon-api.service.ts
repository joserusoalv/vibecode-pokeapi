import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getPokemonIndex(limit = 10000): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`);
  }

  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getTypeDetails(idOrName: string | number): Observable<TypeDetail> {
    return this.http.get<TypeDetail>(`${this.baseUrl}/type/${idOrName}`);
  }

  getTypeDetailsByUrl(url: string): Observable<TypeDetail> {
    return this.http.get<TypeDetail>(url);
  }

  getMoveDetails(url: string): Observable<MoveDetail> {
    return this.http.get<MoveDetail>(url);
  }
}
