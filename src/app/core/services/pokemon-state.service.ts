import { Injectable, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { PokemonApiService } from './pokemon-api.service';
import { PokemonExtendedBase, PokemonBase } from '../models/pokemon.model';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class PokemonStateService {
  private readonly apiService = inject(PokemonApiService);

  // --- Atomic Signals ---
  private readonly _indexData = signal<PokemonExtendedBase[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(20);
  private readonly _indexLoadingState = signal<LoadingState>('idle');
  private readonly _indexError = signal<string | null>(null);

  private readonly _typesList = signal<PokemonBase[]>([]);
  private readonly _selectedType = signal<string>('');
  private readonly _typeFilterIds = signal<Set<number> | null>(null);

  private readonly typeSubject = new Subject<string>();

  constructor() {
    this.typeSubject.pipe(
      distinctUntilChanged(),
      switchMap(type => {
        if (!type) {
          return of(null);
        }
        this._indexLoadingState.set('loading');
        return this.apiService.getTypeDetails(type).pipe(
          map(res => {
            return new Set(res.pokemon.map(p => {
              const parts = p.pokemon.url.split('/').filter(Boolean);
              return parseInt(parts[parts.length - 1], 10);
            }));
          }),
          catchError(() => of(new Set<number>()))
        );
      }),
      takeUntilDestroyed()
    ).subscribe((ids) => {
      this._typeFilterIds.set(ids);
      if (this._indexData().length > 0) {
         this._indexLoadingState.set('success');
      }
      this._currentPage.set(1);
    });
  }

  // --- Read-only Exposures ---
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly itemsPerPage = this._itemsPerPage.asReadonly();
  readonly indexLoadingState = this._indexLoadingState.asReadonly();
  readonly indexError = this._indexError.asReadonly();
  readonly typesList = this._typesList.asReadonly();
  readonly selectedType = this._selectedType.asReadonly();

  // --- Computed State ---
  readonly filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let data = this._indexData();
    
    const typeIds = this._typeFilterIds();
    if (typeIds !== null) {
      data = data.filter(p => typeIds.has(p.id));
    }

    if (!query) return data;
    return data.filter((p) => p.name.includes(query) || p.id.toString() === query);
  });

  readonly totalItems = computed(() => this.filteredData().length);
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()) || 1);

  readonly paginatedData = computed(() => {
    const data = this.filteredData();
    const page = this.currentPage();
    const limit = this.itemsPerPage();
    const startIndex = (page - 1) * limit;
    return data.slice(startIndex, startIndex + limit);
  });

  // --- Actions ---
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
    this._currentPage.set(1); // Reset page on search
  }

  setSelectedType(type: string): void {
    this._selectedType.set(type);
    this.typeSubject.next(type);
  }

  setPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this._currentPage.set(page);
    }
  }

  loadTypes(): void {
    if (this._typesList().length > 0) return;
    this.apiService.getTypes().subscribe({
      next: (res) => {
        // Sort types alphabetically
        const sorted = res.results.sort((a, b) => a.name.localeCompare(b.name));
        this._typesList.set(sorted);
      },
      error: (err) => console.error('Failed to load types', err)
    });
  }

  loadIndexData(): void {
    if (this._indexData().length > 0 || this._indexLoadingState() === 'loading') {
      return; // Already loaded or loading
    }

    this._indexLoadingState.set('loading');
    this.apiService.getPokemonIndex().subscribe({
      next: (response) => {
        // Map out the ID from the URL to avoid parsing later
        const enriched = response.results.map((p) => {
          const parts = p.url.split('/').filter(Boolean);
          const id = parseInt(parts[parts.length - 1], 10);
          return { ...p, id };
        });
        this._indexData.set(enriched);
        this._indexLoadingState.set('success');
      },
      error: (err) => {
        this._indexError.set(err.message || 'Failed to load Pokemon data');
        this._indexLoadingState.set('error');
      },
    });
  }
}
