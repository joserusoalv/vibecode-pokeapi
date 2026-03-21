import { Component, computed, input } from '@angular/core';
import { PokemonDetail } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-stats',
  standalone: true,
  imports: [],
  host: { class: 'block h-full' },
  template: `
    <div class="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
      <!-- General Stats -->
      <div
        class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
      >
        <h3
          class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-200"
        >
          <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          General Info
        </h3>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700/50"
          >
            <span
              class="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
              >Weight</span
            >
            <span
              class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 font-medium text-slate-800 dark:border-slate-700/30 dark:bg-slate-900/50 dark:text-white"
              >{{ pokemon().weight / 10 }} kg</span
            >
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700/50"
          >
            <span
              class="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
              >Height</span
            >
            <span
              class="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 font-medium text-slate-800 dark:border-slate-700/30 dark:bg-slate-900/50 dark:text-white"
              >{{ pokemon().height / 10 }} m</span
            >
          </div>
          <div
            class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700/50"
          >
            <span
              class="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
              >Base Exp</span
            >
            <span
              class="rounded-lg border border-emerald-800/30 bg-emerald-900/20 px-3 py-1 font-bold text-emerald-400"
              >{{ pokemon().base_experience }} XP</span
            >
          </div>
        </div>
      </div>

      <!-- Combat Stats -->
      <div
        class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
      >
        <h3
          class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-200"
        >
          <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Combat Stats
        </h3>

        <div class="space-y-4">
          @for (stat of enrichedStats(); track stat.stat.name) {
            <div class="group space-y-1">
              <div class="flex justify-between text-sm">
                <span
                  class="font-medium text-slate-600 capitalize transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                  >{{ stat.stat.name.replace('-', ' ') }}</span
                >
                <div class="flex gap-2">
                  @if (stat.effort > 0) {
                    <span
                      class="self-center rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-600 dark:bg-amber-500/20 dark:text-amber-300"
                      title="Effort Value"
                      >EV +{{ stat.effort }}</span
                    >
                  }
                  <span class="w-8 text-right font-bold text-slate-900 dark:text-white">{{
                    stat.base_stat
                  }}</span>
                </div>
              </div>
              <div
                class="h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700/50 dark:bg-slate-900/80"
              >
                <div
                  class="relative h-2.5 rounded-full transition-all duration-1000 ease-out"
                  [style.width.%]="(stat.base_stat / 255) * 100"
                  [class]="stat.colorClass"
                >
                  <div class="absolute inset-0 w-full animate-pulse bg-white/20"></div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PokemonStatsComponent {
  pokemon = input.required<PokemonDetail>();

  enrichedStats = computed(() => {
    return this.pokemon().stats.map((stat) => {
      let colorClass = 'bg-gradient-to-r from-blue-500 to-blue-400';
      if (stat.base_stat < 50) {
        colorClass = 'bg-gradient-to-r from-red-500 to-red-400';
      } else if (stat.base_stat < 80) {
        colorClass = 'bg-gradient-to-r from-amber-500 to-amber-400';
      } else if (stat.base_stat < 110) {
        colorClass = 'bg-gradient-to-r from-emerald-500 to-emerald-400';
      }
      return { ...stat, colorClass };
    });
  });
}
