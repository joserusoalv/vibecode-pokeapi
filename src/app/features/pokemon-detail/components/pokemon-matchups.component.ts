import { Component, computed, inject, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { PokemonDetail, PokemonBase, TypeDetail } from '../../../core/models/pokemon.model';
import { PokemonTypeBadgeComponent } from './pokemon-type-badge.component';

interface MatchupGroup {
  label: string;
  multiplier: string;
  types: PokemonBase[];
  colorClass: string;
}

@Component({
  selector: 'app-pokemon-matchups',
  standalone: true,
  imports: [PokemonTypeBadgeComponent],
  template: `
    <div class="rounded-[2rem] border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 p-6 shadow-xl backdrop-blur-md transition-colors duration-300">
      <h3 class="mb-6 font-mono text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 uppercase">
        Matchups
      </h3>
      
      @if (loading()) {
        <div class="flex h-32 items-center justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      } @else {
        <div class="flex flex-col gap-6">
          @for (group of matchupGroups(); track group.label) {
            @if (group.types.length > 0) {
              <div>
                <div class="mb-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                  <span class="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase">
                    {{ group.label }}
                  </span>
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-bold font-mono shadow-sm" [class]="group.colorClass">
                    {{ group.multiplier }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  @for (type of group.types; track type.name) {
                    <app-pokemon-type-badge [type]="type"></app-pokemon-type-badge>
                  }
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
})
export class PokemonMatchupsComponent {
  pokemon = input.required<PokemonDetail>();
  
  private readonly http = inject(HttpClient);
  
  private readonly req = rxResource<any[], string[]>({
    params: () => this.pokemon().types.map(t => t.type.url),
    stream: ({params}) => {
      if (params.length === 0) return of([]);
      return forkJoin(params.map((url: string) => this.http.get<any>(url)));
    }
  });

  loading = computed(() => this.req.isLoading());

  matchupGroups = computed<MatchupGroup[]>(() => {
    const typeDetails = this.req.value();
    if (!typeDetails || typeDetails.length === 0) return [];

    const multipliers = new Map<string, { multiplier: number, typeBase: PokemonBase }>();

    typeDetails.forEach(detail => {
      const dmg = detail.damage_relations;
      
      const applyMod = (types: PokemonBase[], mod: number) => {
        types.forEach(t => {
          const current = multipliers.get(t.name)?.multiplier ?? 1;
          multipliers.set(t.name, { multiplier: current * mod, typeBase: t });
        });
      };

      applyMod(dmg.double_damage_from, 2);
      applyMod(dmg.half_damage_from, 0.5);
      applyMod(dmg.no_damage_from, 0);
    });

    const groups: MatchupGroup[] = [
      { label: 'Critically Weak', multiplier: '4x', colorClass: 'bg-red-500 text-white dark:bg-red-500/80', types: [] },
      { label: 'Weak', multiplier: 'x2', colorClass: 'bg-rose-400 text-white dark:bg-rose-500/80', types: [] },
      { label: 'Resistant', multiplier: 'x0.5', colorClass: 'bg-emerald-500 text-white dark:bg-emerald-500/80', types: [] },
      { label: 'Highly Resistant', multiplier: 'x0.25', colorClass: 'bg-teal-600 text-white dark:bg-teal-500/80', types: [] },
      { label: 'Immune', multiplier: 'x0', colorClass: 'bg-slate-600 text-white dark:bg-slate-500/80', types: [] },
    ];

    multipliers.forEach(({ multiplier, typeBase }) => {
      if (multiplier === 4) groups[0].types.push(typeBase);
      else if (multiplier === 2) groups[1].types.push(typeBase);
      else if (multiplier === 0.5) groups[2].types.push(typeBase);
      else if (multiplier === 0.25) groups[3].types.push(typeBase);
      else if (multiplier === 0) groups[4].types.push(typeBase);
    });

    return groups.filter(g => g.types.length > 0);
  });
}
