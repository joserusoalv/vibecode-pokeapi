import {} from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PokemonBase } from '../../../core/models/pokemon.model';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-type-badge',
  standalone: true,
  imports: [],
  template: `
    @if (iconUrl()) {
      <img [src]="iconUrl()" [alt]="type().name" width="80" />
    } @else if (loading()) {
      <div
        class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-500 border-t-emerald-500 dark:border-t-emerald-400"
      ></div>
    }
  `,
})
export class PokemonTypeBadgeComponent {
  type = input.required<PokemonBase>();

  private readonly typeReq = httpResource<any>(() => this.type().url);

  iconUrl = computed(() => {
    const res = this.typeReq.value();
    if (!res?.sprites) return null;
    let icon = null;
    const genKeys = Object.keys(res.sprites);
    for (const gen of genKeys) {
      const gameObj = res.sprites[gen];
      if (gameObj && typeof gameObj === 'object') {
        const gameKeys = Object.keys(gameObj);
        for (const game of gameKeys) {
          if (gameObj[game]?.name_icon) {
            icon = gameObj[game].name_icon;
            break;
          }
        }
      }
      if (icon) break;
    }
    return icon;
  });

  loading = computed(() => this.typeReq.isLoading());
}
