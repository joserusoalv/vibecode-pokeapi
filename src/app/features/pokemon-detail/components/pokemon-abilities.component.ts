import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonBase } from '../../../core/models/pokemon.model';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';
import { AbilityDetail } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-abilities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex w-full flex-col gap-3 mt-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Abilities
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (item of abilities(); track item.ability.name) {
          <div
            class="flex flex-col gap-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 p-4 backdrop-blur transition-all duration-300 hover:border-emerald-300/50 dark:hover:border-emerald-500/30 hover:bg-white/60 dark:hover:bg-slate-800/60"
          >
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-800 dark:text-slate-100 capitalize">
                {{ item.ability.name.replace('-', ' ') }}
              </span>
              @if (item.is_hidden) {
                <span
                  class="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                >
                  Hidden
                </span>
              }
            </div>
            
            <div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              @if (abilityDetails()[item.ability.name]) {
                {{ getEnglishEffect(abilityDetails()[item.ability.name]!) }}
              } @else {
                <div class="flex items-center gap-2 py-1 opacity-70">
                  <div class="h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                  <span class="text-xs italic">Loading...</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PokemonAbilitiesComponent {
  abilities = input.required<{ ability: PokemonBase; is_hidden: boolean; slot: number }[]>();
  private readonly apiService = inject(PokemonApiService);
  
  abilityDetails = signal<Record<string, AbilityDetail>>({});

  constructor() {
    effect(() => {
      this.abilities().forEach((item) => {
        this.apiService.getAbilityDetails(item.ability.url).subscribe({
          next: (detail: AbilityDetail) => {
            this.abilityDetails.update((current: Record<string, AbilityDetail>) => ({
              ...current,
              [item.ability.name]: detail,
            }));
          },
          error: (err: unknown) => console.error('Failed to load ability details for ' + item.ability.name, err),
        });
      });
    });
  }

  getEnglishEffect(detail: AbilityDetail): string {
    const entry = detail.effect_entries.find((e: any) => e.language.name === 'en');
    return entry ? entry.short_effect || entry.effect : 'No description available.';
  }
}
