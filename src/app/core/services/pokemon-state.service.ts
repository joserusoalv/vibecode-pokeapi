import { Injectable, inject, signal, computed } from '@angular/core';
import { PokemonApiService } from './pokemon-api.service';
import { PokemonExtendedBase } from '../models/pokemon.model';

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

  // --- Read-only Exposures ---
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly itemsPerPage = this._itemsPerPage.asReadonly();
  readonly indexLoadingState = this._indexLoadingState.asReadonly();
  readonly indexError = this._indexError.asReadonly();

  // --- Computed State ---
  readonly filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const data = this._indexData();
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

  setPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this._currentPage.set(page);
    }
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
