import {} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PokemonStateService } from '../../core/services/pokemon-state.service';
import { PokemonPaginationComponent } from './components/pokemon-pagination.component';
import { PokemonSearchComponent } from './components/pokemon-search.component';
import { PokemonTableComponent } from './components/pokemon-table.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';

@Component({
  selector: 'app-pokemon-explorer',
  standalone: true,
  imports: [
    PokemonSearchComponent,
    PokemonTableComponent,
    PokemonPaginationComponent,
    ThemeToggleComponent,
  ],
  template: `
    <div
      class="min-h-screen bg-slate-50 bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-12 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-900 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200"
    >
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6 lg:top-8 lg:right-8">
        <app-theme-toggle></app-theme-toggle>
      </div>

      <div class="mx-auto max-w-5xl">
        <div class="mb-12 text-center">
          <h1
            class="mb-4 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-md dark:from-emerald-400 dark:to-blue-500"
          >
            Poké Explorer
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Discover and explore the entire Pokémon universe instantly.
          </p>
        </div>

        @if (state.indexLoadingState() === 'loading' && state.filteredData().length === 0) {
          <div class="flex items-center justify-center py-20">
            <div
              class="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-emerald-500"
            ></div>
          </div>
        } @else if (state.indexError()) {
          <div
            class="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400"
            role="alert"
          >
            <span class="font-medium">Error!</span> {{ state.indexError() }}
          </div>
        } @else {
          <!-- Search -->
          <app-pokemon-search
            [query]="state.searchQuery()"
            (queryChange)="onSearch($event)"
            [typesList]="state.typesList()"
            [selectedType]="state.selectedType()"
            (selectedTypeChange)="onTypeChange($event)"
          >
          </app-pokemon-search>

          <!-- Table -->
          <app-pokemon-table [data]="state.paginatedData()"> </app-pokemon-table>

          <!-- Pagination -->
          @if (state.totalPages() > 1 || state.currentPage() > 1) {
            <app-pokemon-pagination
              [currentPage]="state.currentPage()"
              [totalPages]="state.totalPages()"
              (pageChange)="onPageChange($event)"
            >
            </app-pokemon-pagination>
          }
        }
      </div>
    </div>
  `,
})
export class PokemonExplorerComponent implements OnInit {
  public state = inject(PokemonStateService);

  ngOnInit() {
    this.state.loadIndexData();
    this.state.loadTypes();
  }

  onSearch(query: string) {
    this.state.setSearchQuery(query);
  }

  onPageChange(page: number) {
    this.state.setPage(page);
  }

  onTypeChange(type: string) {
    this.state.setSelectedType(type);
  }
}
