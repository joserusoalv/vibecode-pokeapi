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
      class="relative overflow-x-auto border border-slate-200 bg-white/70 shadow-2xl backdrop-blur-xl transition-colors duration-300 sm:rounded-2xl dark:border-slate-700 dark:bg-slate-800/50"
    >
      <table class="w-full text-left text-sm text-slate-700 dark:text-slate-300">
        <thead
          class="border-b border-slate-200 bg-slate-100/80 text-xs text-slate-500 uppercase dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
        >
          <tr>
            <th scope="col" class="px-6 py-4">ID</th>
            <th scope="col" class="px-6 py-4">Name</th>
            <th scope="col" class="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          @for (pokemon of data(); track pokemon.id) {
            <tr
              class="group border-b border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/60"
            >
              <td class="px-6 py-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                #{{ pokemon.id | number: '3.0-0' }}
              </td>
              <td
                class="px-6 py-4 font-medium text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300"
              >
                {{ pokemon.name | titlecase }}
              </td>
              <td class="cursor-pointer px-6 py-4 text-right">
                <a
                  [routerLink]="['/pokemon', pokemon.id]"
                  class="text-xs tracking-wider text-slate-500 uppercase transition-colors group-hover:text-emerald-600 hover:text-emerald-600 dark:group-hover:text-emerald-400 dark:hover:text-emerald-400"
                >
                  View Details &rarr;
                </a>
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
