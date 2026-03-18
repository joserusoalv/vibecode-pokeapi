import { TitleCasePipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MoveDetail, PokemonBase } from '../../../core/models/pokemon.model';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';

@Component({
  selector: 'app-pokemon-moves',
  standalone: true,
  imports: [TitleCasePipe],
  template: `
    <div
      class="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-6 shadow-lg backdrop-blur-md"
    >
      <h3 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-200">
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

      <div class="custom-scrollbar max-h-[600px] space-y-3 overflow-y-auto pr-2">
        @for (item of displayedMoves(); track item.move.name) {
          <div
            class="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 transition-all hover:border-slate-600/50"
          >
            <button
              (click)="toggleMove(item.move)"
              class="group flex w-full items-center justify-between bg-transparent px-4 py-3 focus:bg-slate-800/50 focus:outline-none"
            >
              <span
                class="font-medium text-slate-300 transition-colors group-hover:text-emerald-400"
                >{{ item.move.name.replace('-', ' ') | titlecase }}</span
              >
              <svg
                class="h-5 w-5 transform transition-transform duration-300"
                [class]="
                  expandedMoveUrl() === item.move.url
                    ? 'rotate-180 text-emerald-400'
                    : 'text-slate-500'
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
              class="overflow-hidden bg-slate-900/80 transition-all duration-300 ease-in-out"
              [style.max-height]="expandedMoveUrl() === item.move.url ? '500px' : '0'"
              [style.opacity]="expandedMoveUrl() === item.move.url ? '1' : '0'"
            >
              <div class="border-t border-slate-700/50 px-4 py-4 pb-5">
                @if (moveDetails()?.id && expandedMoveUrl() === item.move.url) {
                  <div class="grid grid-cols-2 gap-4">
                    <div
                      class="rounded-lg border border-slate-700/30 bg-slate-800/50 p-2 text-center"
                    >
                      <div class="mb-1 text-xs tracking-wider text-slate-400 uppercase">Power</div>
                      <div
                        class="text-lg font-bold"
                        [class]="moveDetails()!.power ? 'text-amber-400' : 'text-slate-500'"
                      >
                        {{ moveDetails()!.power || '--' }}
                      </div>
                    </div>
                    <div
                      class="rounded-lg border border-slate-700/30 bg-slate-800/50 p-2 text-center"
                    >
                      <div class="mb-1 text-xs tracking-wider text-slate-400 uppercase">
                        Accuracy
                      </div>
                      <div
                        class="text-lg font-bold"
                        [class]="moveDetails()!.accuracy ? 'text-blue-400' : 'text-slate-500'"
                      >
                        {{ moveDetails()!.accuracy ? moveDetails()!.accuracy + '%' : '--' }}
                      </div>
                    </div>
                    <div
                      class="rounded-lg border border-slate-700/30 bg-slate-800/50 p-2 text-center"
                    >
                      <div class="mb-1 text-xs tracking-wider text-slate-400 uppercase">PP</div>
                      <div class="text-lg font-bold text-emerald-400">{{ moveDetails()!.pp }}</div>
                    </div>
                    <div
                      class="rounded-lg border border-slate-700/30 bg-slate-800/50 p-2 text-center"
                    >
                      <div class="mb-1 text-xs tracking-wider text-slate-400 uppercase">
                        Priority
                      </div>
                      <div
                        class="text-lg font-bold"
                        [class]="moveDetails()!.priority > 0 ? 'text-red-400' : 'text-slate-300'"
                      >
                        {{
                          moveDetails()!.priority > 0
                            ? '+' + moveDetails()!.priority
                            : moveDetails()!.priority
                        }}
                      </div>
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
          class="mt-4 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-3 text-sm font-semibold text-slate-400 shadow-sm transition-all hover:border-slate-500 hover:bg-slate-700/80 hover:text-white active:scale-[0.98]"
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

  private readonly apiService = inject(PokemonApiService);

  expandedMoveUrl = signal<string | null>(null);
  moveDetails = signal<MoveDetail | null>(null);

  get displayedMoves() {
    return () => this.moves().slice(0, this.limit());
  }

  toggleMove(move: PokemonBase): void {
    if (this.expandedMoveUrl() === move.url) {
      this.expandedMoveUrl.set(null);
      return;
    }

    this.expandedMoveUrl.set(move.url);
    this.moveDetails.set(null);

    this.apiService.getMoveDetails(move.url).subscribe({
      next: (details: any) => this.moveDetails.set(details),
      error: () => this.expandedMoveUrl.set(null),
    });
  }
}
