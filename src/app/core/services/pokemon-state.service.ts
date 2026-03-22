import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { PokemonBase, PokemonExtendedBase } from '../models/pokemon.model';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class PokemonStateService {
  // --- Atomic Signals ---
  private readonly _searchQuery = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(20);
  private readonly _selectedType = signal<string>('');

  // --- HTTP Resources ---
  private readonly indexRequest = httpResource<any>(
    () => 'https://pokeapi.co/api/v2/pokemon?limit=10000',
  );
  private readonly typesRequest = httpResource<any>(() => 'https://pokeapi.co/api/v2/type');

  private readonly typeFilterRequest = httpResource<any>(() =>
    this._selectedType() ? `https://pokeapi.co/api/v2/type/${this._selectedType()}` : undefined,
  );

  // --- Computed State ---

  readonly allPokemonData = computed<PokemonExtendedBase[]>(() => {
    const data = this.indexRequest.value();
    if (!data) return [];
    return data.results.map((p: any) => {
      const parts = p.url.split('/').filter(Boolean);
      return { ...p, id: parseInt(parts[parts.length - 1], 10) };
    });
  });

  readonly typesList = computed<PokemonBase[]>(() => {
    const data = this.typesRequest.value();
    if (!data) return [];
    return data.results.sort((a: any, b: any) => a.name.localeCompare(b.name));
  });

  private readonly _typeFilterIds = computed<Set<number> | null>(() => {
    const type = this._selectedType();
    if (!type) return null;

    const data = this.typeFilterRequest.value();
    if (!data) return null;

    return new Set<number>(
      data.pokemon.map((p: any) => {
        const parts = p.pokemon.url.split('/').filter(Boolean);
        return parseInt(parts[parts.length - 1], 10);
      }),
    );
  });

  readonly filteredData = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let data = this.allPokemonData();

    const typeIds = this._typeFilterIds();
    if (typeIds !== null) {
      data = data.filter((p) => typeIds.has(p.id));
    }

    if (!query) return data;

    return data.filter((p) => {
      const stringId = p.id.toString();
      const paddedId = stringId.padStart(3, '0');
      return p.name.includes(query) || stringId.includes(query) || paddedId.includes(query);
    });
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

  readonly indexLoadingState = computed<LoadingState>(() => {
    if (
      this.indexRequest.isLoading() ||
      (this._selectedType() && this.typeFilterRequest.isLoading())
    ) {
      return 'loading';
    }
    if (this.indexRequest.error() || this.typeFilterRequest.error()) {
      return 'error';
    }
    return 'success';
  });

  readonly indexError = computed<string | null>(() => {
    const err = this.indexRequest.error() || this.typeFilterRequest.error();
    return err ? 'Failed to load data' : null;
  });

  // --- Read-only Exposures ---
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly itemsPerPage = this._itemsPerPage.asReadonly();
  readonly selectedType = this._selectedType.asReadonly();

  // --- Actions ---
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
    this._currentPage.set(1);
  }

  setSelectedType(type: string): void {
    this._selectedType.set(type);
    this._currentPage.set(1);
  }

  setPage(page: number): void {
    const total = this.totalPages();
    if (page >= 1 && page <= total) {
      this._currentPage.set(page);
    }
  }

  loadTypes(): void {
    /* No-op */
  }
  loadIndexData(): void {
    /* No-op */
  }
}
