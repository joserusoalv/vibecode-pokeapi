import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonExtendedBase } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-table',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, DecimalPipe],
  template: `
    <div
      class="relative overflow-x-auto border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 shadow-2xl backdrop-blur-xl sm:rounded-2xl transition-colors duration-300"
    >
      <table class="w-full text-left text-sm text-slate-700 dark:text-slate-300">
        <thead class="border-b border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
          <tr>
            <th scope="col" class="px-6 py-4">ID</th>
            <th scope="col" class="px-6 py-4">Name</th>
            <th scope="col" class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (pokemon of data(); track pokemon.id) {
            <tr
              class="group cursor-pointer border-b border-slate-200 dark:border-slate-700/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/60"
              [routerLink]="['/pokemon', pokemon.id]"
            >
              <td class="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                #{{ pokemon.id | number: '3.0-0' }}
              </td>
              <td
                class="px-6 py-4 font-medium text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
              >
                {{ pokemon.name | titlecase }}
              </td>
              <td class="px-6 py-4 text-right">
                <span
                  class="text-xs tracking-wider text-slate-500 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 uppercase"
                  >View Details &rarr;</span
                >
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="3" class="px-6 py-12 text-center text-slate-400">
                No Pokémon found matching your search.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class PokemonTableComponent {
  data = input.required<PokemonExtendedBase[]>();
}
