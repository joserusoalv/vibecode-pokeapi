import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { PokemonBase } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  template: `
    <div class="mx-auto mb-6 grid w-full max-w-2xl gap-4 sm:grid-cols-[1fr_auto]">
      <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          [ngModel]="query()"
          (ngModelChange)="queryChange.emit($event)"
          class="block w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-4 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-lg backdrop-blur-sm transition-all focus:border-blue-500 focus:shadow-blue-500/20 focus:ring-blue-500"
          placeholder="Search Pokémon by name or ID..."
          required
        />
      </div>
      <div class="w-full sm:w-48">
        <select
          [ngModel]="selectedType()"
          (ngModelChange)="selectedTypeChange.emit($event)"
          class="block w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-4 text-sm text-slate-900 dark:text-white shadow-lg backdrop-blur-sm transition-all focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          @for (type of typesList(); track type.name) {
            <option [value]="type.name">{{ type.name | titlecase }}</option>
          }
        </select>
      </div>
    </div>
  `,
})
export class PokemonSearchComponent {
  query = input<string>('');
  queryChange = output<string>();

  typesList = input<PokemonBase[]>([]);
  selectedType = input<string>('');
  selectedTypeChange = output<string>();
}
