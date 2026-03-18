import {} from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PokemonBase } from '../../../core/models/pokemon.model';
import { PokemonApiService } from '../../../core/services/pokemon-api.service';

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
export class PokemonTypeBadgeComponent implements OnInit {
  type = input.required<PokemonBase>();
  private readonly apiService = inject(PokemonApiService);

  iconUrl = signal<string | null>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.apiService.getTypeDetailsByUrl(this.type().url).subscribe({
      next: (res: any) => {
        let icon = null;
        if (res.sprites) {
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
        }
        this.iconUrl.set(icon);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
