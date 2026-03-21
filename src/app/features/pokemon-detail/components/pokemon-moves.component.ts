import { TitleCasePipe } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MoveDetail, PokemonBase } from '../../../core/models/pokemon.model';
import { httpResource } from '@angular/common/http';
import { PokemonTypeBadgeComponent } from './pokemon-type-badge.component';

@Component({
  selector: 'app-pokemon-moves',
  standalone: true,
  imports: [TitleCasePipe, PokemonTypeBadgeComponent],
  template: `
    <div
      class="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
    >
      <h3 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-200">
        <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        Learnable Moves
      </h3>

      <div class="space-y-3">
        @for (item of displayedMoves(); track item.move.name) {
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-slate-600/50"
          >
            <button
              (click)="toggleMove(item.move)"
              class="group flex w-full items-center justify-between bg-transparent px-4 py-3 focus:bg-slate-100 focus:outline-none dark:focus:bg-slate-800/50"
            >
              <span
                class="font-medium text-slate-700 transition-colors group-hover:text-emerald-600 dark:text-slate-300 dark:group-hover:text-emerald-400"
                >{{ item.move.name.replace('-', ' ') | titlecase }}</span
              >
              <svg
                class="h-5 w-5 transform transition-transform duration-300"
                [class]="
                  expandedMoveUrl() === item.move.url
                    ? 'rotate-180 text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Expanded Details -->
            <div
              class="overflow-hidden bg-white transition-all duration-300 ease-in-out dark:bg-slate-900/80"
              [style.max-height]="expandedMoveUrl() === item.move.url ? '500px' : '0'"
              [style.opacity]="expandedMoveUrl() === item.move.url ? '1' : '0'"
            >
              <div class="border-t border-slate-200 px-4 py-4 pb-5 dark:border-slate-700/50">
                @if (moveDetails()?.id && expandedMoveUrl() === item.move.url) {
                  <div class="flex flex-col gap-5">
                    <!-- Top metrics row -->
                    <div class="flex flex-wrap items-center justify-between gap-4">
                      <div class="flex-shrink-0">
                        <app-pokemon-type-badge
                          [type]="moveDetails()!.type"
                        ></app-pokemon-type-badge>
                      </div>

                      <div class="flex flex-wrap gap-3">
                        <div
                          class="flex min-w-[4rem] flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700/30 dark:bg-slate-800/50"
                        >
                          <span
                            class="mb-1 text-[10px] tracking-wider text-slate-500 uppercase dark:text-slate-400"
                            >Power</span
                          >
                          <span
                            class="text-base font-bold"
                            [class]="
                              moveDetails()!.power
                                ? 'text-amber-500 dark:text-amber-400'
                                : 'text-slate-400 dark:text-slate-500'
                            "
                            >{{ moveDetails()!.power || '--' }}</span
                          >
                        </div>
                        <div
                          class="flex min-w-[4rem] flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700/30 dark:bg-slate-800/50"
                        >
                          <span
                            class="mb-1 text-[10px] tracking-wider text-slate-500 uppercase dark:text-slate-400"
                            >Accuracy</span
                          >
                          <span
                            class="text-base font-bold"
                            [class]="
                              moveDetails()!.accuracy
                                ? 'text-blue-500 dark:text-blue-400'
                                : 'text-slate-400 dark:text-slate-500'
                            "
                            >{{
                              moveDetails()!.accuracy ? moveDetails()!.accuracy + '%' : '--'
                            }}</span
                          >
                        </div>
                        <div
                          class="flex min-w-[4rem] flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700/30 dark:bg-slate-800/50"
                        >
                          <span
                            class="mb-1 text-[10px] tracking-wider text-slate-500 uppercase dark:text-slate-400"
                            >PP</span
                          >
                          <span
                            class="text-base font-bold text-emerald-600 dark:text-emerald-400"
                            >{{ moveDetails()!.pp }}</span
                          >
                        </div>
                        <div
                          class="flex min-w-[4rem] flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700/30 dark:bg-slate-800/50"
                        >
                          <span
                            class="mb-1 text-[10px] tracking-wider text-slate-500 uppercase dark:text-slate-400"
                            >Priority</span
                          >
                          <span
                            class="text-base font-bold"
                            [class]="
                              moveDetails()!.priority > 0
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-slate-500 dark:text-slate-300'
                            "
                            >{{
                              moveDetails()!.priority > 0
                                ? '+' + moveDetails()!.priority
                                : moveDetails()!.priority
                            }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Effect description -->
                    <div
                      class="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/30"
                    >
                      <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {{ getEnglishEffect(moveDetails()!.effect_entries) }}
                      </p>
                    </div>
                  </div>
                } @else if (expandedMoveUrl() === item.move.url) {
                  <div class="flex items-center justify-center py-6">
                    <div
                      class="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400"
                    ></div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
      @if (moves().length > limit()) {
        <button
          (click)="limit.set(limit() + 10)"
          class="mt-4 w-full rounded-xl border border-slate-200 bg-slate-100 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 active:scale-[0.98] dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700/80 dark:hover:text-white"
        >
          Load More Moves
        </button>
      }
    </div>
  `,
})
export class PokemonMovesComponent {
  moves = input.required<{ move: PokemonBase }[]>();
  limit = signal<number>(10);

  expandedMoveUrl = signal<string | null>(null);

  private readonly moveReq = httpResource<MoveDetail>(() => this.expandedMoveUrl() || undefined);

  moveDetails = computed(() => this.moveReq.value());

  get displayedMoves() {
    return () => this.moves().slice(0, this.limit());
  }

  toggleMove(move: PokemonBase): void {
    if (this.expandedMoveUrl() === move.url) {
      this.expandedMoveUrl.set(null);
      return;
    }
    this.expandedMoveUrl.set(move.url);
  }

  getEnglishEffect(entries: any[]): string {
    if (!entries || entries.length === 0) return 'No description available.';
    const entry = entries.find((e) => e.language.name === 'en');
    return entry ? entry.short_effect : entries[0].short_effect || 'No description available.';
  }
}
