import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PokemonDetail } from '../../core/models/pokemon.model';
import { PokemonStateService } from '../../core/services/pokemon-state.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';
import { PokemonAbilitiesComponent } from './components/pokemon-abilities.component';
import { PokemonAudioComponent } from './components/pokemon-audio.component';
import { PokemonMatchupsComponent } from './components/pokemon-matchups.component';
import { PokemonMovesComponent } from './components/pokemon-moves.component';
import { PokemonRadarStatsComponent } from './components/pokemon-radar-stats.component';
import { PokemonSpritesComponent } from './components/pokemon-sprites.component';
import { PokemonStatsComponent } from './components/pokemon-stats.component';
import { PokemonTypeBadgeComponent } from './components/pokemon-type-badge.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    RouterLink,
    PokemonTypeBadgeComponent,
    PokemonAbilitiesComponent,
    PokemonSpritesComponent,
    PokemonStatsComponent,
    PokemonRadarStatsComponent,
    PokemonMatchupsComponent,
    PokemonAudioComponent,
    PokemonMovesComponent,
    ThemeToggleComponent,
    DecimalPipe,
  ],
  host: {
    '(window:keydown.ArrowLeft)': 'goToPrevious()',
    '(window:keydown.ArrowRight)': 'goToNext()',
  },
  template: `
    <div
      class="relative min-h-screen bg-slate-50 bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8 text-slate-800 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-900 dark:from-slate-900 dark:to-slate-950 dark:text-slate-200"
    >
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6 z-50 lg:top-8 lg:right-8">
        <app-theme-toggle></app-theme-toggle>
      </div>

      <div class="mx-auto max-w-6xl">
        <!-- Back Navigation -->
        <a
          [routerLink]="['/pokemon']"
          class="group relative z-10 mb-8 inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <svg
            class="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span
            class="border-b border-transparent font-medium tracking-wide transition-colors group-hover:border-emerald-400"
            >Back to Explorer</span
          >
        </a>

        @if (loading()) {
          <div class="flex items-center justify-center py-32">
            <div
              class="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-emerald-500"
            ></div>
          </div>
        } @else if (error()) {
          <div
            class="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-xl backdrop-blur transition-colors duration-300 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
          >
            <svg
              class="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-500/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 class="mb-2 text-2xl font-bold">Something went wrong</h2>
            <p class="text-slate-600 dark:text-slate-300">{{ error() }}</p>
            <a
              [routerLink]="['/pokemon']"
              class="mt-6 inline-block rounded-xl border border-slate-300 bg-white px-6 py-2.5 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-600 dark:hover:bg-slate-700"
            >
              Return Home
            </a>
          </div>
        } @else if (pokemon()) {
          <!-- Header Card -->
          <div
            class="relative mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/70 p-8 shadow-2xl backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
          >
            <!-- Decorative background glows -->
            <div
              class="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]"
            ></div>
            <div
              class="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[80px]"
            ></div>

            <div
              class="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start"
            >
              <div class="flex flex-col items-center gap-4 md:items-start">
                <div class="flex items-center gap-4 sm:gap-6">
                  <!-- Previous Button -->
                  <button
                    (click)="goToPrevious()"
                    [disabled]="!prevPokemonId()"
                    class="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/50 text-slate-500 backdrop-blur transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:text-emerald-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white/50 disabled:hover:text-slate-500 disabled:hover:shadow-none sm:h-12 sm:w-12 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-slate-800 dark:hover:text-emerald-400 dark:disabled:hover:border-slate-700 dark:disabled:hover:bg-slate-800/50 dark:disabled:hover:text-slate-400"
                    aria-label="Previous Pokémon"
                  >
                    <svg
                      class="h-5 w-5 transform transition-transform group-hover:-translate-x-1 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <span
                    class="font-mono text-2xl font-semibold tracking-wider text-emerald-600/80 sm:text-3xl dark:text-emerald-400/80"
                    >#{{ pokemon()!.id | number: '3.0-0' }}</span
                  >

                  <!-- Next Button -->
                  <button
                    (click)="goToNext()"
                    [disabled]="!nextPokemonId()"
                    class="group flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/50 text-slate-500 backdrop-blur transition-all duration-300 hover:border-emerald-300 hover:bg-white hover:text-emerald-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white/50 disabled:hover:text-slate-500 disabled:hover:shadow-none sm:h-12 sm:w-12 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-slate-800 dark:hover:text-emerald-400 dark:disabled:hover:border-slate-700 dark:disabled:hover:bg-slate-800/50 dark:disabled:hover:text-slate-400"
                    aria-label="Next Pokémon"
                  >
                    <svg
                      class="h-5 w-5 transform transition-transform group-hover:translate-x-1 sm:h-6 sm:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <h1
                  class="max-w-[16rem] bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text pb-2 text-center text-4xl leading-tight font-extrabold break-words text-transparent capitalize drop-shadow-sm transition-colors duration-300 sm:max-w-sm sm:text-5xl md:max-w-md md:text-left md:text-6xl md:leading-snug lg:max-w-max dark:from-white dark:to-slate-400"
                >
                  {{ pokemon()!.name.replace('-', ' ') }}
                </h1>
                <!-- Types -->
                <div class="mt-4 flex flex-wrap gap-3">
                  @for (typeInfo of pokemon()!.types; track typeInfo.slot) {
                    <app-pokemon-type-badge [type]="typeInfo.type"></app-pokemon-type-badge>
                  }
                </div>

                @if (pokemon()!.abilities && pokemon()!.abilities.length > 0) {
                  <!-- Abilities -->
                  <div class="mt-2 w-full max-w-2xl">
                    <app-pokemon-abilities
                      [abilities]="pokemon()!.abilities"
                    ></app-pokemon-abilities>
                  </div>
                }
              </div>

              <!-- Audio and Main Image -->
              <div class="mt-4 flex flex-col items-center gap-6 md:mt-0">
                <div class="group relative">
                  <div
                    class="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                  ></div>
                  @if (
                    pokemon()!.sprites.other &&
                    pokemon()!.sprites.other['official-artwork'] &&
                    pokemon()!.sprites.other['official-artwork'].front_default
                  ) {
                    <img
                      [src]="pokemon()!.sprites.other['official-artwork'].front_default"
                      [alt]="pokemon()!.name"
                      class="relative z-10 h-56 w-56 object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-105 md:h-64 md:w-64"
                    />
                  } @else if (pokemon()!.sprites.front_default) {
                    <img
                      [src]="pokemon()!.sprites.front_default"
                      [alt]="pokemon()!.name"
                      class="relative z-10 h-48 w-48 object-contain drop-shadow-xl filter transition-transform duration-500 group-hover:scale-105"
                    />
                  }
                </div>

                @if (pokemon()!.cries.latest) {
                  <app-pokemon-audio [src]="pokemon()!.cries.latest"></app-pokemon-audio>
                }
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="flex flex-col gap-8">
            <div class="w-full">
              <app-pokemon-sprites [sprites]="pokemon()!.sprites"></app-pokemon-sprites>
            </div>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div class="flex flex-col gap-8">
                <app-pokemon-stats [pokemon]="pokemon()!"></app-pokemon-stats>
              </div>

              <div class="flex flex-col gap-8">
                <app-pokemon-radar-stats [pokemon]="pokemon()!"></app-pokemon-radar-stats>
              </div>

              <div class="flex flex-col gap-8">
                <app-pokemon-matchups [pokemon]="pokemon()!"></app-pokemon-matchups>
              </div>
            </div>
            <div class="w-full">
              <app-pokemon-moves [moves]="pokemon()!.moves"></app-pokemon-moves>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PokemonDetailComponent {
  id = input.required<string>(); // Binded automatically via withComponentInputBinding()

  private readonly stateService = inject(PokemonStateService);
  private readonly router = inject(Router);

  private readonly detailReq = httpResource<PokemonDetail>(() =>
    this.id() ? `https://pokeapi.co/api/v2/pokemon/${this.id()}` : undefined,
  );

  pokemon = computed(() => this.detailReq.value());
  loading = computed(() => this.detailReq.isLoading());
  error = computed(() =>
    this.detailReq.error() ? 'Pokémon not found, or there was a network error.' : null,
  );

  readonly allPokemon = this.stateService.allPokemonData;

  readonly prevPokemonId = computed(() => {
    const currentId = this.pokemon()?.id;
    const list = this.allPokemon();
    if (!currentId || list.length === 0) return null;
    const idx = list.findIndex((p) => p.id === currentId);
    if (idx > 0) return list[idx - 1].id;
    return null;
  });

  readonly nextPokemonId = computed(() => {
    const currentId = this.pokemon()?.id;
    const list = this.allPokemon();
    if (!currentId || list.length === 0) return null;
    const idx = list.findIndex((p) => p.id === currentId);
    if (idx !== -1 && idx < list.length - 1) return list[idx + 1].id;
    return null;
  });

  goToPrevious() {
    const prevId = this.prevPokemonId();
    if (prevId) {
      this.router.navigate(['/pokemon', prevId]);
    }
  }

  goToNext() {
    const nextId = this.nextPokemonId();
    if (nextId) {
      this.router.navigate(['/pokemon', nextId]);
    }
  }
}
